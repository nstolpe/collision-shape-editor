// hooks/usePointerInteractions.js
import { useState } from 'react';

import {
  insertVertex,
  deleteVertex,
  setSelectOverlayDimensions,
  setSelectOverlay,
  moveVertices,
  setVertexPositionsRelativeToCoordinates,
  openShape,
  closeShape,
} from 'actions/actions';
import * as Tools from 'constants/tools';
import * as Modes from 'constants/modes';
import ScreenContext from 'contexts/ScreenContext';
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
import selectOverlayComparator from 'comparators/select-overlay';
import { keySelector } from 'selectors/keys';

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
  addModifierKeyPressed: !!keySelector(addModifierCode)({ pressedKeyCodes }),
  panModifierKeyPressed: !!keySelector(panModifierCode)({ pressedKeyCodes }),
});

const comparator = ({
  selectOverlay,
  vertices,
  pressedKeyCodes,
  ...restProps
}, {
  selectOverlay: oldSelectOverlay,
  vertices: oldVertices,
  pressedKeyCodes: oldPressedKeyCodes,
  ...restOldProps
}) => {
  if (!selectOverlayComparator(selectOverlay, oldSelectOverlay)) {
    return false;
  }

  // pressedKeyCodes
  if (Object.keys(pressedKeyCodes).length !== Object.keys(oldPressedKeyCodes).length) {
    return false;
  }

  const length = Object.keys(pressedKeyCodes).length;

  for (let i = 0; i < length; i++) {
    if (pressedKeyCodes[i] !== oldPressedKeyCodes[i]) {
      return false;
    }
  }
  // end pressedKeyCodes

  for (let i = 0, l = vertices?.length; i < l; i++) {
    const vertex = vertices.index(i);
    const oldVertex = oldVertices.index(i);

    if (
      vertex.name !== oldVertex.name ||
      vertex.x !== oldVertex.x ||
      vertex.y !== oldVertex.y
    ) {
      return false;
    }
  }

  for (let key of Object.keys(restProps)) {
    if (restProps[key] !== restOldProps[key]) {
      return false;
    }
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
  // `true` indicates that a `pointerdown` even just removed whatever it's target was. clear on pointerup
  const [justRemoved, setJustRemoved] = useState(false);
  // queued selected vertices = { name: string, distance: { x: number, y: number} }
  // const [queuedVertices, setQueuedVertices] = useState([]);
  // vertices that have been selected by a pointer. same structure as queued selected vertices
  const [selectedVertices, setSelectedVertices] = useState({});
  const [selectedEdges, setSelectedEdges] = useState({});
  const {
    dispatch,
    mode,
    selectOverlay,
    tool,
    shapes,
    vertices,
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
  const addSelectedVertex = (name, distance) => {
    setSelectedVertices(currentSelectedVertices => {
      currentSelectedVertices[name] = distance;
      return currentSelectedVertices;
    });
  };

  const addSelectedVertices = newVertices =>
    setSelectedVertices(
      currentSelectedVertices => {
        newVertices.forEach(({ distance, name }) => currentSelectedVertices[name] = distance);
        return currentSelectedVertices;
      }
    );
  /**
   * Removes a vertex from selectedVertices
   */
  const removeSelectedVertex = name =>
    setSelectedVertices(
      currentSelectedVertices => {
        delete currentSelectedVertices[name];
        return currentSelectedVertices;
      }
    );

  const removeSelectedVertices = names => {
    setSelectedVertices(
      currentSelectedVertices => {
        names.forEach(name => delete currentSelectedVertices[name]);
        return currentSelectedVertices;
      }
    );
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
    setSelectedVertices(currentSelectedVertices => {
      Object.keys(currentSelectedVertices).forEach(name => {
        const { x, y } = vertices.key(name);
        // const { x, y } = vertices.find(vertex => vertex.id === removePrefix(name, VERTEX));
        const distance = translation({ x, y }, coordinates);
        currentSelectedVertices[name] = distance;
      });

      return currentSelectedVertices;
    });
  };
  /***********************************************************************************
   * End events, these will eventually receive the event data and dispatch an action *
   ***********************************************************************************/
  const handleAddVertexToEdge = (coordinates, name) => {
    const [, vertexKey, vertexKey2, , shapeKey] = name.split(DEFAULT_DELIMITER);
    const vertex1 = vertices.key(
      `${VERTEX}${DEFAULT_DELIMITER}${vertexKey}${DEFAULT_DELIMITER}${SHAPE}${DEFAULT_DELIMITER}${shapeKey}`
    );
    const vertex2 = vertices.key(
      `${VERTEX}${DEFAULT_DELIMITER}${vertexKey2}${DEFAULT_DELIMITER}${SHAPE}${DEFAULT_DELIMITER}${shapeKey}`
    );
    const [x, y] = closestPointOnSegment(vertex1, vertex2, coordinates);

    dispatch(insertVertex({ shapeKey, vertexKey, x, y }));
  };

  const handleVertexSelect = ({ name, coordinates, position, addModifierKeyPressed }) => {
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
        setSelectedVertices({ [name]: translation(coordinates, position) });
      }
    }
  };

  const handleVertexDelete = name => {
    const [, vertexKey, , shapeKey] = name.split(DEFAULT_DELIMITER);
    dispatch(deleteVertex({ shapeKey, vertexKey }));
  };

  /**
   * Checks if the conditions are right to close a shape (first or last vertex
   * of an open shape is selected and the last or first is clicked).
   */
  const handleAddClickOnVertex = ({ coordinates, name, position }) => {
    const [, vertexKey, , shapeKey] = name.split(DEFAULT_DELIMITER);
    const shape = shapes.key(shapeKey);
    const vertex = shape.vertices.key(vertexKey);

    if (!shape.closed && Object.keys(selectedVertices).length === 1) {
      // the shape is open and only one vertex is selected. This could potentially close the shape.
      if (shape.vertices.last === vertex) {
        // the vertex is the last vertex of the shape, if the other is the first vertex...
        const [, selectedVertexKey] = Object.keys(selectedVertices)[0].split(DEFAULT_DELIMITER);
        if (selectedVertexKey === shape.vertices.keys[0]) {
          // ...close it
          addSelectedVertex(name, translation(coordinates, position));
          setSelectedVertices({});
          dispatch(closeShape(shapeKey));
        }
      }

      if (shape.vertices.first === vertex) {
        // the vertex is the first vertex of the shape, if the other is the first vertex...
        const [, selectedVertexKey] = Object.keys(selectedVertices)[0].split(DEFAULT_DELIMITER);
        if (selectedVertexKey === shape.vertices.keys[shape.vertices.length - 1]) {
          // ...close it
          // addSelectedVertex(name, translation(coordinates, position));
          setSelectedVertices({});
          dispatch(closeShape(shapeKey));
        }
      }
    } else if (!shape.closed && ([shape.vertices.first, shape.vertices.last].includes(vertex))) {
      // if the target vertex is the first or last of an open shape, select only that vertex
      setSelectedVertices({ [name]: translation(coordinates, position) });
    }
  };

  const handleSelectEdge = (coordinates, name) => {
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
          setSelectedVertices(targetEdgeVertices.reduce((vertices, { distance, name }) => {
            vertices[name] = distance;
            return vertices;
          }, {}));
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
      data: { identifier },
      target,
    } = event;
    const viewport = findViewportParent(event.target);

    if (!viewport) {
      return;
    }

    const coordinates = event.data.getLocalPosition(viewport);

    // the pointer that just touched down is now active.
    setActivePointers(currentActivePointers => [...currentActivePointers, { coordinates, identifier, target }]);

    switch (true) {
      case target.name === 'VIEWPORT':
        // main container viewport
        handlePointerDownViewport(event, coordinates);
        break;
      case hasPrefix(target.name, SHAPE):
        // @TODO add handler for shape, pass on control to viewport there if necessary.
        handlePointerDownViewport(event, coordinates);
        break;
      case hasPrefix(target.name, VERTEX):
        // vertex
        handlePointerDownVertex(event, coordinates);
        break;
      case hasPrefix(target.name, EDGE):
        // edge
        handlePointerDownEdge(event, coordinates);
        break;
      default:
        break;
    }
  };

  /**
   * Main pointermove, covers a large variety of interactions.
   */
  const handlePointerMove = event => {
    // exit early if the activePointers is empty.
    // for when a pointer moves onto the pixi canvas from outside.
    if (!activePointers.length || !event.target) {
      return;
    }

    const {
      data: { identifier } = {},
    } = event;
    const pointerIndex = activePointers.findIndex(pointer => pointer.identifier === identifier);
    const pointer = activePointers[pointerIndex];

    if (!pointer) {
      return;
    }

    const viewport = findViewportParent(event.target);

    if (!viewport) {
      return;
    }

    const pointerCoordinates = event.data.getLocalPosition(viewport);

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
        // main container viewport
        // using global (viewport?) coordinates. size is right, position is wrong.
        // handlePointerMoveViewport(event, pointer, { x: event.data.global.x, y: event.data.global.y });
        handlePointerMoveViewport(event, pointer, pointerCoordinates);
        break;
      case hasPrefix(pointer?.target?.name, SHAPE):
        // @TODO add handler for shape, pass on control to viewport there if necessary.
        handlePointerMoveViewport(event, pointer, pointerCoordinates);
        break;
      case hasPrefix(pointer?.target?.name, VERTEX):
        // the active pointer's cached target from pointerdown is a vertex.
        handlePointerMoveVertex(event, pointer, pointerCoordinates);
        break;
      case hasPrefix(pointer?.target?.name, EDGE):
        // the active pointer's cached target from pointerdown is an edge.
        handlePointerMoveEdge(event, pointer, pointerCoordinates);
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
        handlePointerUpViewport(event);
        break;
      case hasPrefix(name, SHAPE):
        // @TODO add handler for shape, pass on control to viewport there if necessary.
        handlePointerUpViewport(event);
        break;
      case hasPrefix(name, VERTEX):
        handlePointerUpVertex(event);
        break;
      case hasPrefix(name, EDGE):
        handlePointerUpEdge(event);
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

  const handlePointerDownViewport = (event, coordinates) => {
    const { x, y } = coordinates;
    const height = 0;
    const width = 0;

    if (tool === Tools.SELECT && !panModifierKeyPressed) {
      dispatch(setSelectOverlay({
        enabled: true,
        x,
        y,
        width,
        height,
      }));
    }
  }

  const handlePointerDownVertex = (event, coordinates) => {
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
        handleAddClickOnVertex({
          name,
          coordinates,
          position,
        });
        break;
      case Tools.DELETE:
        handleVertexDelete(name);
        break;
      case Tools.SELECT:
      default:
        handleVertexSelect({
          name,
          coordinates,
          position,
          addModifierKeyPressed,
        });
    }
  };

  const handlePointerDownEdge = (event, coordinates) => {
    const {
      data: {
        identifier,
      } = {},
      target: { name } = {},
    } = event;

    updateTranslations(coordinates);

    switch (tool) {
      case Tools.ADD:
        handleAddVertexToEdge(coordinates, name);
        break;
      case Tools.SELECT:
        handleSelectEdge(coordinates, name);
        break;
      default:
        // nothing
    }
  };

  const handlePointerMoveViewport = (event, activePointer, pointerCoordinates) => {
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

  const handlePointerMoveVertex = (event, activePointer, pointerCoordinates) => {
    const {
      data: {
        originalEvent: {
          shiftKey = false,
        } = {},
      } = {},
    } = event;

    switch (true) {
      // case shiftKey:
      //   break;
      default:
        if (Object.keys(selectedVertices).length && !justRemoved) {
          const updatedVertices = [];

          for (const name in selectedVertices) {
            const distance = selectedVertices[name];
            updatedVertices.push({
              name,
              x: pointerCoordinates.x + distance.x,
              y: pointerCoordinates.y + distance.y,
            });
          }

          dispatch(setVertexPositionsRelativeToCoordinates(selectedVertices, pointerCoordinates));
        }
    }

    // event.stopPropagation();
  };

  const handlePointerMoveEdge = (event, pointer, coordinates) => {
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

    // event.stopPropagation();
  };

  const handlePointerUpViewport = () => {
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
                name: addPrefix(VERTEX, key),
                distance: { x: 0, y: 0 },
              });
              return newSelectedVertices;
            },
            []
          )
        );
      } else {
        // replace the selection
        setSelectedVertices(
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
        );
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

  const handlePointerUpVertex = event => {
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

  const handlePointerUpEdge = event => {
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
    handlePointerMove,
    handlePointerUp,
    selectedVertices,
  };
};

export default usePointerInteraction;
