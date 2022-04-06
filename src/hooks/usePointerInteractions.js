// hooks/usePointerInteractions.js
import { useCallback, useState } from 'react';
import * as PIXI from 'pixi.js';

import {
  insertVertexBefore,
  insertVertexAfter,
  deleteEdge,
  deleteVertex,
  setSelectOverlayDimensions,
  setSelectOverlay,
  setVertexPositionsRelativeToCoordinates,
  createShape,
  openShape,
  closeShape,
  joinShapes,
  setContextMenu,
  setContextMenuOpen,
  setContextMenuPosition,
  setSelectedVertices,
  setPointerCoordinates,
} from 'actions/actions';
import * as Tools from 'constants/tools';
import * as Modes from 'constants/modes';
import ScreenContext from 'contexts/ScreenContext';
import throttle from 'tools/throttle';
import List from 'tools/List';
import {
  closestPointOnSegment,
  translation,
  withinAABB,
} from 'tools/math';
import {
  DEFAULT_DELIMITER,
  addPrefix,
  hasPrefix,
  removePrefix,
} from 'tools/prefix';
import { EDGE, VERTEX, SHAPE } from 'constants/prefixes';
import useSelector from 'hooks/useSelector';
import restComparator from 'comparators/rest';
import selectOverlayComparator from 'comparators/select-overlay';
import selectedVerticesComparator from 'comparators/selected-vertices';
import verticesComparator from 'comparators/vertices';
import { keySelector } from 'selectors/keys';

// @TODO break this file up. maybe convert it into multiple hooks.. useCallback(handler)
// https://stackoverflow.com/a/55015145
// or make into an hoc? (still break out functions).
// consider combining some logic from the reducer helpers
const selector = ({
  dispatch,
  mode,
  selectOverlay,
  tool,
  shapes,
  uiOptions: {
    vertexRadius,
  },
  addModifierCode,
  subtractModifierCode,
  panModifierCode,
  pressedKeyCodes,
  selectedVertices,
}) => ({
  dispatch,
  mode,
  selectOverlay,
  tool,
  shapes,
  // project all the vertices into a flattened List
  // @TODO move this to util: Projections.flattenShapeVertices(shapes);
  vertices: shapes.reduce((vertices, shape, _, shapeKey) => {
    shape.vertices.forEach(
      (vertex, _, vertexKey) => {
        const key = `${addPrefix(VERTEX, vertexKey)}${DEFAULT_DELIMITER}${addPrefix(SHAPE, shapeKey)}`
        vertices.push(vertex, key);
      }
    );

    return vertices;
  }, new List()),
  vertexRadius,
  addModifierCode,
  subtractModifierCode,
  panModifierCode,
  pressedKeyCodes,
  selectedVertices,
  addModifierKeyPressed: !!keySelector(addModifierCode)({ pressedKeyCodes }),
  panModifierKeyPressed: !!keySelector(panModifierCode)({ pressedKeyCodes }),
});

const comparator = ({
  selectOverlay,
  vertices,
  pressedKeyCodes,
  selectedVertices,
  ...restProps
}, {
  selectOverlay: oldSelectOverlay,
  vertices: oldVertices,
  pressedKeyCodes: oldPressedKeyCodes,
  selectedVertices: oldSelectedVertices,
  ...restOldProps
}) => {
  if (!selectOverlayComparator(selectOverlay, oldSelectOverlay)) {
    return false;
  }

  // pressedKeyCodes
  const keyCodeLength = Object.keys(pressedKeyCodes).length;

  if (keyCodeLength !== Object.keys(oldPressedKeyCodes).length) {
    return false;
  }

  for (let i = 0; i < keyCodeLength; i++) {
    if (pressedKeyCodes[i] !== oldPressedKeyCodes[i]) {
      return false;
    }
  }
  // end pressedKeyCodes

  if (!selectedVerticesComparator(selectedVertices, oldSelectedVertices)) {
    return false;
  }

  if (!verticesComparator(vertices, oldVertices)) {
    return false;
  }

  if (!restComparator(restProps, restOldProps)) {
    return false;
  }

  return true;
};

/**
 * Finds and returns the parent of a Pixi component
 * that has the `name` equal to the `VIEWPORT` constant.
 * Or returns `null`.
 */
const findViewportParent = child => {
  let viewport = null;

  while (!viewport && child != null) {
    if (child && child.name == 'VIEWPORT') {
      viewport = child;
      child = null;
    }

    if (child && child.parent) {
      if (child.parent.name === 'VIEWPORT') {
        viewport = child.parent;
        child = null;
      } else {
        child = child.parent;
      }
    } else {
      child = null;
    }
  }

  return viewport;
};

const usePointerInteraction = () => {
  // pointers currently interacting with the component.
  // pointer = { coordinates: { x: number, y: number }, identifier: number, target: PIXI.DisplayObject, }
  const [activePointers, setActivePointers] = useState([]);
  const [lastMoved, setLastMoved] = useState(0);
  // `true` indicates that a `pointerdown` even just removed whatever it's target was. clear on pointerup
  const [justRemoved, setJustRemoved] = useState(false);
  // queued selected vertices = { name: string, distance: { x: number, y: number} }
  // const [queuedVertices, setQueuedVertices] = useState([]);
  // vertices that have been selected by a pointer. same structure as queued selected vertices
  // const [selectedVertices, setSelectedVertices] = useState({});
  const {
    dispatch,
    mode,
    selectOverlay,
    tool,
    shapes,
    vertices,
    selectedVertices,
    vertexRadius,
    addModifierCode,
    subtractModifierCode,
    panModifierCode,
    addModifierKeyPressed,
    panModifierKeyPressed,
    pressedKeyCodes,
  } = useSelector(ScreenContext, selector, comparator);
  /**************************************************************************************
   * utility functions                                                                  *
   * at least some of these can be moved out of the hook, and accept `vertices` or      *
   * `currentSelectedVertices` ass additional arguments.                                *
   **************************************************************************************/

  /**
   * Adds a vertex to `queuedVertices` storing `name` and `identifier`.
   * @param {number} name        The `name` attribute of of a PIXI.DisplayObject.
   */
  // const addQueuedVertices = vertices => setQueuedVertices(
  //   currentQueuedSelectedVertices => [
  //     ...currentQueuedSelectedVertices,
  //     ...vertices
  //   ]
  // );

  // vertices = [{ name: 'abc', distance: { x: 1.0, y: 0.1 } }]
  /**
   * Adds a vertex to selectedVertices
   */
  const addSelectedVertex = (name, distance) => dispatch(setSelectedVertices({ ...selectedVertices, [name]: distance}));

  const addSelectedVertices = addedVertices => {
    dispatch(setSelectedVertices({
      ...selectedVertices,
      ...addedVertices.reduce((result, { distance, name }) => {
        result[name] = distance;
        return result;
      }, {}),
    }));
  }

  /**
   * Removes a vertex from selectedVertices
   */
  const removeSelectedVertex = name => {
    const newSelectedVertices = { ...selectedVertices };

    delete newSelectedVertices[name];

    dispatch(setSelectedVertices(newSelectedVertices));
  };

  const removeSelectedVertices = names => {
    const newSelectedVertices = { ...selectedVertices };

    names.forEach(name => delete newSelectedVertices[name]);

    dispatch(setSelectedVertices(newSelectedVertices));
  };

  const isVertexSelected = ({ name }) => !!selectedVertices.find(vertex => vertex.name === name);

  /**
   *  Returns `true` if all vertices in `checkVertices` are selected (`vertex.name`
   *  is present in `selectedVertices`). Otherwise returns `false`.
   *
   * @param {Object[]} checkVertices  An array of vertices
   * @returns {bool}
   */
  const areAllVerticesSelected = checkVertices => {
    for (let vertex of checkVertices) {
      const { name } = vertex;

      if (!selectedVertices.hasOwnProperty(name)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Returns subset of `checkVertices` that also exist in `selectedVertices`.
   *
   * @param {Object[]} checkVertices  An array of vertex objects
   * @returns {Object[]}  An array of vertex objects
   */
  const areVerticesSelected = checkVertices => checkVertices.reduce((areSelected, vertex) => {
    const { name } = vertex;

    if (selectedVertices.hasOwnProperty(name)) {
      areSelected.push(vertex);
    }

    return areSelected;
  }, []);

  /**
   * Updates positions of all selected vertices relative to the passed coordinates.
   * @param {Object} coordinates
   * @param {number} coordinates.x
   * @param {number} coordinates.y
   */
  const updateTranslations = coordinates => {
    Object.keys(selectedVertices).forEach(name => {
      const { x, y } = vertices.key(name) ?? {};
      // const { x, y } = vertices.find(vertex => vertex.id === removePrefix(name, VERTEX));
      if (x && y) {
        const distance = translation({ x, y }, coordinates);
        selectedVertices[name] = distance;
      } else {
        console.log("@TODO: if you never see this, remove it. If you do, figure out why you're seeing it");
      }
    });
    Object.entries(selectedVertices).reduce((result, [key, vertex]) => {
      const { x, y } = vertex ?? {};
      // const { x, y } = vertices.find(vtx => vtx.id === removePrefix(name, VERTEX));
      if (x && y) {
        const distance = translation({ x, y }, coordinates);
        result[key] = distance;
      } else {
        console.log("@TODO: if you never see this, remove it. If you do, figure out why you're seeing it");
        result[key] = vertex;
      }

      return result;
    }, {});
  };
  /***********************************************************************************
   * End events, these will eventually receive the event data and dispatch an action *
   ***********************************************************************************/
  const addVertexToEdge = (coordinates, name) => {
    const [, vertexKey, vertexKey2, , shapeKey] = name.split(DEFAULT_DELIMITER);
    const vertex1 = vertices.key(
      `${VERTEX}${DEFAULT_DELIMITER}${vertexKey}${DEFAULT_DELIMITER}${SHAPE}${DEFAULT_DELIMITER}${shapeKey}`
    );
    const vertex2 = vertices.key(
      `${VERTEX}${DEFAULT_DELIMITER}${vertexKey2}${DEFAULT_DELIMITER}${SHAPE}${DEFAULT_DELIMITER}${shapeKey}`
    );
    const [x, y] = closestPointOnSegment(vertex1, vertex2, coordinates);

    dispatch(insertVertexAfter({ shapeKey, vertexKey, x, y }));
    dispatch(setSelectedVertices({}));
  };

  const vertexSelect = ({ name, coordinates, position, addModifierKeyPressed }) => {
    const isVertexSelected = selectedVertices.hasOwnProperty(name);

    if (addModifierKeyPressed) {
      if (isVertexSelected) {
        removeSelectedVertex(name);
        setJustRemoved(true);
      } else {
        addSelectedVertex(name, translation(coordinates, position))
      }
    } else {
      if (!isVertexSelected) {
        dispatch(setSelectedVertices({ [name]: translation(coordinates, position) }));
      }
    }
  };

  const vertexDelete = name => {
    const [, vertexKey, , shapeKey] = name.split(DEFAULT_DELIMITER);

    if (selectedVertices.hasOwnProperty(name)) {
      const newSelectedVertices = { ...selectedVertices };
      delete newSelectedVertices[name];
      dispatch(setSelectedVertices(newSelectedVertices));
    }

    dispatch(deleteVertex({ shapeKey, vertexKey }));
  };

  const edgeDelete = name => {
    const [, vertexKey1, vertexKey2,, shapeKey] = name.split(DEFAULT_DELIMITER);
    dispatch(deleteEdge({ shapeKey, vertexKey1, vertexKey2 }));
  };

  /**
   * Checks if the conditions are right to close a shape (first or last vertex
   * of an open shape is selected and the last or first is clicked).
   * @TODO needs to combine shapes too, when both open and first or last selected on one
   * and first or last clicked on two
   */
  const addClickOnVertex = ({ coordinates, name, position, addModifierKeyPressed }) => {
    const [, vertexKey, , targetShapeKey] = name.split(DEFAULT_DELIMITER);
    const targetShape = shapes.key(targetShapeKey);
    const targetVertex = targetShape.vertices.key(vertexKey);
    const isTargetFirst = targetShape.vertices.first === targetVertex
    const isTargetLast = targetShape.vertices.last === targetVertex;

    if (!targetShape.closed && Object.keys(selectedVertices).length === 1) {
      // The targetShape is open and only one other vertex is selected.
      // This could potentially close targetShape or join it with another shape.
      const [, selectedVertexKey, , selectedVertexShapeKey] =
        Object.keys(selectedVertices)?.[0].split(DEFAULT_DELIMITER) || [];

      if (selectedVertexShapeKey === targetShapeKey) {
        // selected and clicked vertices are on the same shape.
        // const [, selectedVertexKey] = Object.keys(selectedVertices)[0].split(DEFAULT_DELIMITER);

        if (isTargetLast) {
          // targetVertex is the last vertex of targetShape, if the other is the first vertex...
          if (selectedVertexKey && selectedVertexKey === targetShape.vertices.keys[0]) {
            // ...close it
            // addSelectedVertex(name, translation(coordinates, position));
            dispatch(setSelectedVertices({}));
            dispatch(closeShape(targetShapeKey));
          }
        }

        if (isTargetFirst) {
          // targetVertex is the first vertex of the shape, if the other is the first vertex...
          if (selectedVertexKey && selectedVertexKey === targetShape.vertices.keys[targetShape.vertices.length - 1]) {
            // ...close it
            // addSelectedVertex(name, translation(coordinates, position));
            dispatch(setSelectedVertices({}));
            dispatch(closeShape(targetShapeKey));
          }
        }
      } else {
        // selected and clicked vertices are on different shapes
        const selectedVertexShape = shapes.key(selectedVertexShapeKey);
        const selectedVertex = selectedVertexShape.vertices.key(selectedVertexKey);
        const isSelectedFirst = selectedVertexShape.vertices.first === selectedVertex;
        const isSelectedLast = selectedVertexShape.vertices.last === selectedVertex;
        let joinType;

        switch (true) {
          case isSelectedFirst && isTargetFirst:
            joinType = 'FIRST_FIRST';
            break;
          case isSelectedFirst && isTargetLast:
            joinType = 'FIRST_LAST';
            break;
          case isSelectedLast && isTargetFirst:
            joinType = 'LAST_FIRST';
            break;
          case isSelectedLast && isTargetLast:
            joinType = 'LAST_LAST';
            break;
          default:
            break;
        }

        if (joinType) {
          dispatch(joinShapes({
            shape1: selectedVertexShape,
            shapeKey1: selectedVertexShapeKey,
            shape2: targetShape,
            shapeKey2: targetShapeKey,
            joinType,
          }));
          dispatch(setSelectedVertices({}));
        }
      }
    // } else if (!targetShape.closed && ([targetShape.vertices.first, targetShape.vertices.last].includes(targetVertex))) {
    } else {
      // if the target vertex is the first or last of an open shape, select only that vertex
      vertexSelect({
        name,
        coordinates,
        position,
        addModifierKeyPressed,
      });
    }
  };

  /**
   * Selects vertices on either end of an edge.
   */
  const selectEdge = (coordinates, name) => {
    const [, vertexId1, vertexId2] = name.split(DEFAULT_DELIMITER);
    const targetEdgeVertices = [vertexId1, vertexId2].reduce((newVertices, id) => {
      const shapeKey = name.substring(name.indexOf('SHAPE'));
      const key = addPrefix(VERTEX, `${id}${DEFAULT_DELIMITER}${shapeKey}`);
      const value = vertices.key(key);

      if (value) {
        const { x, y } = value;

        newVertices.push({
          name: key,
          distance: translation({ x, y }, coordinates),
        });
      }

      return newVertices;
    }, []);

    switch (true) {
      case addModifierKeyPressed:
        const selected = areVerticesSelected(targetEdgeVertices);

        if (areAllVerticesSelected(targetEdgeVertices)) {
          setJustRemoved(true);
          removeSelectedVertices(targetEdgeVertices.map(({ name }) => name));
        } else {
          addSelectedVertices(targetEdgeVertices);
        }
        break;
      default:
        const vertex1Selected = selectedVertices.hasOwnProperty(
          addPrefix(
            VERTEX,
            `${vertexId1}${DEFAULT_DELIMITER}${name.substring(name.indexOf(SHAPE))}`
          )
        );
        const vertex2Selected = selectedVertices.hasOwnProperty(
          addPrefix(
            VERTEX,
            `${vertexId2}${DEFAULT_DELIMITER}${name.substring(name.indexOf(SHAPE))}`
          )
        );
        if (
          !vertex1Selected ||
          !vertex2Selected
        ) {
          dispatch(setSelectedVertices(targetEdgeVertices.reduce((vertices, { distance, name }) => {
            vertices[name] = distance;
            return vertices;
          }, {})));
        }
    }
  };

  /****************************************************************************************
   * Main pointer events, catch all interactions and pass them to more specific handlers. *
   ***************************************************************************************/

  /**
   * Main pointerdown, initial entry for most events.
   */
  const handlePointerDown = event => {
    const {
      data: {
        button,
        identifier,
      },
      target,
    } = event;
    const viewport = findViewportParent(event.target);

    if (!viewport) {
      return;
    }

    const coordinates = event.data.getLocalPosition(viewport);

    if (button === 0) {
      // the pointer that just touched down is now active.
      setActivePointers(currentActivePointers => [...currentActivePointers, { coordinates, identifier, target }]);

      switch (true) {
        case target.name === 'VIEWPORT':
          // main container viewport
          pointerDownViewport(event, coordinates);
          break;
        case hasPrefix(target.name, SHAPE):
          // @TODO add handler for shape, pass on control to viewport there if necessary.
          // or delete. probably the better option. shapes have no hit area now and are checked
          // below under the secondary (button === 2) click condition
          pointerDownViewport(event, coordinates);
          break;
        case hasPrefix(target.name, VERTEX):
          // vertex
          pointerDownVertex(event, coordinates);
          break;
        case hasPrefix(target.name, EDGE):
          // edge
          pointerDownEdge(event, coordinates);
          break;
        default:
          break;
      }
    }

    if (button === 2) {
       // @TODO move to secondary click handler
      const {
        data: {
          originalEvent: {
            clientX,
            clientY,
          },
        },
      } = event;
      switch (true) {
        case target.name === 'VIEWPORT': {
          // handle hits on shapes here. Activating hitArea on shapes
          // excludes the parts of vertices that extend beyond the hitArea.

          const [targetShape, targetShapeKey] = shapes.reduce((result, shape, index, key) => {
            const polygon = new PIXI.Polygon(shape.vertices.values);
            const l = target.toLocal({ x: clientX, y: clientY });

            // @TODO something w/ z index here?
            if (result !== undefined) {
              return result;
            }

            if (polygon.contains(l.x, l.y)) {
              return [shape, key];
            }
          }) ?? [];

          if (targetShapeKey) {
            dispatch(setContextMenu(
              SHAPE,
              clientX,
              clientY,
              {
                shape: targetShape,
                shapeKey: targetShapeKey,
              }
            ));
          }
          break;
        }
        case hasPrefix(target.name, VERTEX):
        case hasPrefix(target.name, EDGE):
        default:
          break;
      }
    }
  };

  /**
   * Main pointermove, covers a large variety of interactions.
   * @TODO decide whether throttling this whole function or
   */
  const handlePointerMove = event => {
      const {
        data: { identifier } = {},
        target,
      } = event;
      const pointerIndex = activePointers.findIndex(pointer => pointer.identifier === identifier);
      const pointer = activePointers[pointerIndex];
      const viewport = findViewportParent(target);

      // the move event isn't over the pixi canvas. clear out pointer coords and exit early.
      if (!viewport) {
        dispatch(setPointerCoordinates());
        return;
      }

      const pointerCoordinates = event.data.getLocalPosition(viewport);

      dispatch(setPointerCoordinates(pointerCoordinates.x, pointerCoordinates.y));

      // exit early if the activePointers is empty.
      // for when a pointer moves onto the pixi canvas from outside.
      if (!pointer || !activePointers.length || !target) {
        return;
      }

      // update pointerCoordinates of the active pointer.
      setActivePointers(currentActivePointers => [
        ...currentActivePointers.slice(0, pointerIndex),
        {
          ...pointer,
          coordinates: pointerCoordinates,
        },
        ...currentActivePointers.slice(pointerIndex + 1),
      ]);

      switch (true) {
        case pointer?.target?.name === 'VIEWPORT':
        case hasPrefix(pointer?.target?.name, SHAPE):
          // main container viewport
          // using global (viewport?) coordinates. size is right, position is wrong.
          // pointerMoveViewport(event, pointer, { x: event.data.global.x, y: event.data.global.y });
          pointerMoveViewport(event, pointer, pointerCoordinates);
          break;
        case hasPrefix(pointer?.target?.name, VERTEX):
          // the active pointer's cached target from pointerdown is a vertex.
          pointerMoveVertex(event, pointer, pointerCoordinates);
          break;
        case hasPrefix(pointer?.target?.name, EDGE):
          // the active pointer's cached target from pointerdown is an edge.
          pointerMoveEdge(event, pointer, pointerCoordinates);
          break;
        default:
          break;
      }
    };

  /**
   * Main pointerup, final main entry for an interaction.
   */
  const handlePointerUp = event => {
    const {
      data: { identifier },
      // target,
    } = event;
    const pointer = activePointers.find(activePointer => activePointer.identifier === identifier);

    // pointer entered from outside the pixi canvas and was released.
    if (!pointer) {
      return
    }

    const {
      target: {
        name,
      } = {},
    } = pointer;

    switch (true) {
      case name === 'VIEWPORT':
        // main container viewport
        pointerUpViewport(event);
        break;
      case hasPrefix(name, SHAPE):
        // @TODO add handler for shape, pass on control to viewport there if necessary.
        pointerUpViewport(event);
        break;
      case hasPrefix(name, VERTEX):
        pointerUpVertex(event);
        break;
      case hasPrefix(name, EDGE):
        pointerUpEdge(event);
        break;
      default:
        break;
    }

    // remove this pointer from active pointers. valid for VERTICES and all children.
    setActivePointers(
      currentActivePointers => currentActivePointers.filter(activePointer => activePointer.identifier !== identifier)
    );

    setJustRemoved(false);
  };

  const extendShapeOrAddShape = coordinates => {
    const { x, y } = coordinates;
    const selectedVertexKeys = Object.keys(selectedVertices);

    if (selectedVertexKeys.length === 1) {
      // one selected vertex...
      const [selectedVertexKey] = selectedVertexKeys;
      const [, vertexKey,, shapeKey] = selectedVertexKey.split(DEFAULT_DELIMITER);
      const shape = shapes.key(shapeKey);
      const vertices = shape.vertices;

      if (!shape.closed && vertexKey === vertices.keys[0]) {
        // ...it was the first in a shape, prepend a new one before it
        return dispatch(insertVertexBefore({ shapeKey, vertexKey, x, y, makeSelected: true }));
      } else if (!shape.closed && vertexKey === vertices.keys[vertices.length - 1]) {
        // ...it was the last in a shape, prepend a new one after it
        return dispatch(insertVertexAfter({ shapeKey, vertexKey, x, y, makeSelected: true }));
      }
    }
    dispatch(createShape({ vertices: List([{ ...coordinates }]) }));
  };

  const pointerDownViewport = (event, coordinates) => {
    if (!panModifierKeyPressed) {
      switch (true) {
        case (tool === Tools.SELECT): {
          const { x, y } = coordinates;

          dispatch(setSelectOverlay({
            enabled: true,
            x,
            y,
            width: 0,
            height: 0,
          }));
          break;
        }
        case tool === Tools.ADD:
          extendShapeOrAddShape(coordinates)
          break;
        default:
          //
      }
    }
  }

  const pointerDownVertex = (event, coordinates) => {
    const {
      data: {
        identifier,
      } = {},
      target: {
        name,
        position,
      } = {},
    } = event;

    updateTranslations(coordinates);

    switch (tool) {
      case Tools.ADD:
        addClickOnVertex({
          name,
          coordinates,
          position,
          addModifierKeyPressed,
        });
        break;
      case Tools.DELETE:
        vertexDelete(name);
        break;
      case Tools.SELECT:
      default:
        vertexSelect({
          name,
          coordinates,
          position,
          addModifierKeyPressed,
        });
    }
  };

  const pointerDownEdge = (event, coordinates) => {
    const {
      data: {
        identifier,
      } = {},
      target: { name } = {},
    } = event;

    updateTranslations(coordinates);

    switch (tool) {
      case Tools.ADD:
        addVertexToEdge(coordinates, name);
        break;
      case Tools.DELETE:
        edgeDelete(name);
        break;
      case Tools.SELECT:
        selectEdge(coordinates, name);
        break;
      default:
        // nothing
    }
  };

  const pointerMoveViewport = (event, activePointer, pointerCoordinates) => {
    const { x, y } = pointerCoordinates;
    switch (tool) {
      case Tools.SELECT:
        dispatch(setSelectOverlayDimensions({
          width: x - selectOverlay.x,
          height: y - selectOverlay.y,
        }));
        break;
      default:
        break
    }
  };

  const pointerMoveVertex = (event, activePointer, pointerCoordinates) => {
    const {
      data: {
        originalEvent: {
          shiftKey = false,
        } = {},
      } = {},
    } = event;

    switch (true) {
      // case tool === Tools.ADD:
      case tool === Tools.DELETE:
        break;
      // case shiftKey:
      //   break;
      default: {
        if (Object.keys(selectedVertices).length && !justRemoved) {
          dispatch(setVertexPositionsRelativeToCoordinates(selectedVertices, pointerCoordinates));
        }
      }
    }
  };

  const pointerMoveEdge = (event, pointer, coordinates) => {
    const {
      data: {
        originalEvent: {
          shiftKey = false,
        } = {},
      } = {},
    } = event;

    if (Object.keys(selectedVertices).length && !justRemoved) {
      const updatedVertices = [];

      for (const name in selectedVertices) {
        const distance = selectedVertices[name];

        updatedVertices.push({
          name,
          x: coordinates.x + distance.x,
          y: coordinates.y + distance.y,
        });
      }

      dispatch(setVertexPositionsRelativeToCoordinates(selectedVertices, coordinates));
    }
  };

  const pointerUpViewport = () => {
    // if a select by overlay is in process, change the selection
    // this could be its own function
    if (selectOverlay.enabled) {
      const targetVertices = vertices.filter(({ x, y }) =>
        withinAABB(
          { x, y },
          { x: selectOverlay.x, y: selectOverlay.y },
          {
            x: selectOverlay.x + selectOverlay.width,
            y: selectOverlay.y + selectOverlay.height,
          },
          vertexRadius
        )
      );

      if (addModifierKeyPressed) {
        // add to the selection
        addSelectedVertices(
          targetVertices.reduce(
            (
              newSelectedVertices,
              { x, y },
              idx,
              key,
            ) => {
              newSelectedVertices.push({
                name: key,
                distance: { x: 0, y: 0 },
              });
              return newSelectedVertices;
            },
            []
          )
        );
      } else {
        // replace the selection
        dispatch(setSelectedVertices(
          targetVertices.reduce(
            (
              newSelectedVertices,
              { x, y },
              idx,
              key
            ) => {
              newSelectedVertices[key] = { x: 0, y: 0 };
              return newSelectedVertices;
            },
            {}
          )
        ));
      }

      dispatch(setSelectOverlay({
        enabled: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }));
    }
  };

  const pointerUpVertex = event => {
    const {
      data: {
        identifier,
        originalEvent: {
          shiftKey = false,
        } = {},
      } = {},
    } = event;

    switch (true) {
      case shiftKey:
        break
      default:
        // find this vertex in the selection queue from a pointerdown
        // const [queuedSelectedVertex, queuedSelectedVertexIndex] = queuedVertices.reduce(
        //   (result, vertex, index) => vertex.name === event.target.name ? [vertex, index] : result,
        //   []
        // );
    }
  };

  const pointerUpEdge = event => {
    const {
      data: {
        identifier,
        originalEvent: {
          shiftKey = false,
        } = {},
      } = {},
      target: { name } = {},
    } = event;

    switch (tool) {
      case Tools.SELECT:
        switch (true) {
          case shiftKey:
            break;
          default:
//             const vertexNames = removePrefix(name, EDGE).split(DEFAULT_DELIMITER).map(id => addPrefix(VERTEX, id));
//             const queuedEdgeVertices = [];
//             const restQueuedVertices = [];
//
//             for (let i = 0, l = queuedVertices.length; i < l; i++) {
//               const queuedVertex = queuedVertices[i];
//
//               if (vertexNames.includes(queuedVertex.name)) {
//                 queuedEdgeVertices.push(queuedVertex);
//               } else {
//                 restQueuedVertices.push(queuedVertex);
//               }
//             }
//
//             setSelectedVertices(queuedEdgeVertices);
        }
        break;
      default:
        // nothing
    }
  };

  return {
    handlePointerDown,
    handlePointerMove: useCallback(throttle(handlePointerMove, 50), [activePointers]),
    handlePointerUp,
    selectedVertices,
  };
};

export default usePointerInteraction;
