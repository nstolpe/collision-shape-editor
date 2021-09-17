// hooks/usePointerInteractions.js
import { useState } from 'react';

import {
  setOverlayEnabled,
  setOverlayDimensions,
  setOverlayPosition,
  moveVertices
} from 'actions/actions';
import * as Tools from 'constants/tools';
import { translation } from 'tools/math';
import {
  addPrefix,
  hasPrefix,
  removePrefix,
} from 'tools/prefix';
import { EDGE, VERTEX } from 'constants/prefixes';

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
const usePointerInteraction = (dispatch, tool, vertices, scale) => {
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

  const addSelectedVertices = newVertices => setSelectedVertices(
    currentSelectedVertices => {
      newVertices.forEach(({ distance, name }) => currentSelectedVertices[name] = distance);
      console.log('currentSelectedVertices',currentSelectedVertices)
      return currentSelectedVertices;
    }
  );
  /**
   * Removes a vertex from selectedVertices
   */
  const removeSelectedVertex = name => {
    setSelectedVertices(currentSelectedVertices => {
      delete currentSelectedVertices[name];
      return currentSelectedVertices;
    });
  };

  const removeSelectedVertices = names => {
    setSelectedVertices(currentSelectedVertices => {
      names.forEach(name => delete currentSelectedVertices[name]);
      return currentSelectedVertices;
    });
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
        const { x, y } = vertices.key(removePrefix(name, VERTEX));
        // const { x, y } = vertices.find(vertex => vertex.id === removePrefix(name, VERTEX));
        const distance = translation({ x, y }, coordinates);
        currentSelectedVertices[name] = distance;
      });

      return currentSelectedVertices;
    });
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
      case hasPrefix(target.name, VERTEX):
        // it's a vertex
        handlePointerDownVertex(event, coordinates);
        break;
      case hasPrefix(target.name, EDGE):
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

    dispatch(setOverlayPosition({ x, y }));
    dispatch(setOverlayEnabled(true));
  }

  const handlePointerDownVertex = (event, coordinates) => {
    const {
      data: {
        identifier,
        originalEvent: {
          altKey = false,
          ctrlKey = false,
          shiftKey = false,
        } = {},
      } = {},
      target: { name } = {},
    } = event;

    updateTranslations(coordinates);

    switch (true) {
      // case altKey && ctrlKey && shiftKey:
      //   break;
      // case altKey && ctrlKey:
      //   break;
      // case altKey && shiftKey:
      //   break;
      // case ctrlKey && shiftKey:
      //   break;
      // case altKey:
      //   break;
      // case ctrlKey:
      //   break;
      case shiftKey:
        switch (tool) {
          // case Tools.ADD:
          //   break;
          // case Tools.DELETE:
          //   break;
          case Tools.SELECT:
          default:
            const isVertexSelected = selectedVertices.hasOwnProperty(event.target.name);

            if (isVertexSelected) {
              removeSelectedVertex(event.target.name);
              setJustRemoved(true);
            } else {
              addSelectedVertex(event.target.name, translation(coordinates, event.target.position))
            }
        }
        break;
      default:
        switch (tool) {
          // case Tools.ADD:
          //   break;
          // case Tools.DELETE:
          //   break;
          case Tools.SELECT:
          default:
            const isVertexSelected = selectedVertices.hasOwnProperty(event.target.name);

            if (!isVertexSelected) {
              setSelectedVertices({ [event.target.name]: translation(coordinates, event.target.position)});
            }
        }
    }
  };

  const handlePointerDownEdge = (event, coordinates) => {
    const {
      data: {
        identifier,
        originalEvent: {
          altKey = false,
          ctrlKey = false,
          shiftKey = false,
        } = {},
      } = {},
      target: { name } = {},
    } = event;

    updateTranslations(coordinates);

    switch (tool) {
      case Tools.SELECT:
        const vertexIds = removePrefix(name, EDGE).split('__');
        const targetEdgeVertices = vertexIds.reduce((newVertices, key) => {
          const value = vertices.key(key);

          if (value) {
            const { x, y } = value;

            newVertices.push({
              name: addPrefix(key, VERTEX),
              distance: translation({ x, y }, coordinates),
            });
          }

          return newVertices;
        }, []);

        switch (true) {
          case shiftKey:
            const selected = areVerticesSelected(targetEdgeVertices);

            if (areAllVerticesSelected(targetEdgeVertices)) {
              console.log('edgeDown all selected')
              setJustRemoved(true);
              removeSelectedVertices(vertexIds.map(name => addPrefix(name, VERTEX)));
            } else {
              console.log('edgeDown not all selected')
              addSelectedVertices(targetEdgeVertices);
            }
            // const addVertices = targetEdgeVertices.reduce((acc, vertex) => {
            //   if (selected[vertex.name]) {
            //     acc.push(vertex);
            //   }
            //   return acc;
            // }, []);
            // if (addVertices.length) {
            //   addSelectedVertices(addVertices);
            // }
            break;
          default:
            if (
              !selectedVertices.hasOwnProperty(addPrefix(vertexIds[0], VERTEX)) ||
              !selectedVertices.hasOwnProperty(addPrefix(vertexIds[1], VERTEX))
            ) {
              setSelectedVertices(targetEdgeVertices.reduce((vertices, { distance, name }) => {
                vertices[name] = distance;
                return vertices;
              }, {}));
            }
        }
        break;
      default:
        // nothing
    }
  };

  const handlePointerMoveViewport = (event, activePointer, pointerCoordinates) => {
    const { x, y } = pointerCoordinates;

    dispatch(setOverlayDimensions({ x, y }));
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
              id: removePrefix(name, VERTEX),
              x: pointerCoordinates.x + distance.x,
              y: pointerCoordinates.y + distance.y,
              // x: pointerCoordinates.x + distance.x,
              // y: pointerCoordinates.y + distance.y,
            });
          }

          dispatch(moveVertices(updatedVertices));
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
          id: removePrefix(name, VERTEX),
          x: coordinates.x + distance.x,
          y: coordinates.y + distance.y,
        });
      }

      dispatch(moveVertices(updatedVertices));
    }

    // event.stopPropagation();
  };

  const handlePointerUpViewport = () => {
    dispatch(setOverlayEnabled(false));
    dispatch(setOverlayPosition({ x: 0, y: 0 }));
    dispatch(setOverlayDimensions({ x: 0, y: 0 }));
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
//             const vertexNames = removePrefix(name, EDGE).split('__').map(id => addPrefix(id, VERTEX));
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
