// hooks/usePointerInteractions.js
import { useState } from 'react';

import { moveVertices } from 'actions/actions';
import * as Tools from 'constants/tools';
import { translation } from 'tools/math';
import {
  addPrefix,
  hasPrefix,
  removePrefix,
} from 'tools/prefix';
import { EDGE, VERTEX } from 'constants/prefixes';

const usePointerInteraction = (dispatch, tool, vertices) => {
  // pointers currently interacting with the component.
  // pointer = { coordinates: { x: number, y: number }, identifier: number, target: PIXI.DisplayObject, }
  const [activePointers, setActivePointers] = useState([]);
  // queued selected vertices = { name: string, distance: { x: number, y: number} }
  // const [queuedVertices, setQueuedVertices] = useState([]);
  // vertices that have been selected by a pointer. same structure as queued selected vertices
  const [selectedVertices, setSelectedVertices] = useState({});
  const [selectedEdges, setSelectedEdges] = useState({});


  /**************************************************************************************
   * utility functions                                                                  *
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

  const areAllVerticesSelected = checkVertices => {
    for (let vertex of checkVertices) {
      const { name } = vertex;

      if (!selectedVertices.hasOwnProperty(name)) {
        return false;
      }
    }
    return true;
  };

  const areVerticesSelected = checkVertices => {
    const selected = [];

    for (let i = 0, l = checkVertices.length; i < l; i++) {
      const vertex = checkVertices[i];
      const { name } = vertex;

      if (selectedVertices.hasOwnProperty(name)) {
        selected.push(vertex);
      }
    }

    return selected;
  };

  /* @TODO remove this once certain it's not needed */
  // const toggleSelectVertex = (identifier, name, distance) => {
  //   const vertexIndex = selectedVertices.findIndex(vertex => name === vertex.name);
  //   if (vertexIndex >= 0) {
  //     // the vertex was found, so it's selected. deselect it.
  //     setSelectedVertices(currentSelectedVertices =>
  //       [...currentSelectedVertices.slice(0, vertexIndex), ...currentSelectedVertices.slice(vertexIndex + 1)]
  //     );
  //   } else {
  //     // the vertex wasn't found, so it's not selected. select it.
  //     setSelectedVertices(currentSelectedVertices => ([...currentSelectedVertices, { name, distance }]));
  //   }
  // };

  /**
   * Updates positions of all selected vertices relative to the passed coordinates.
   * @param {Object} coordinates
   * @param {number} coordinates.x
   * @param {number} coordinates.y
   */
  const updateTranslations = coordinates => {
    setSelectedVertices(currentSelectedVertices => {
      Object.keys(currentSelectedVertices).forEach(name => {
        const { x, y } = vertices.find(vertex => vertex.id === removePrefix(name, VERTEX));
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
      currentTarget: parent,
      data: { identifier },
      target,
    } = event;
    const coordinates = event.data.getLocalPosition(parent);
    // the pointer that just touched down is now active.
    setActivePointers(currentActivePointers => [...currentActivePointers, { coordinates, identifier, target }]);

    switch (true) {
      case target.name === 'VERTICES':
        // it's this component
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
      target: { parent } = {},
    } = event;
    // const identifier = event?.data?.identifier;
    // const parent = event?.target?.parent;
    const pointerIndex = activePointers.findIndex(pointer => pointer.identifier === identifier);
    const pointer = activePointers[pointerIndex];

    if (!pointer) {
      return;
    }

    const pointerCoordinates = event.data.getLocalPosition(parent);

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
     case pointer?.target?.name === 'VERTICES':
      // the active pointer's target is the vertices container.
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
      case name === 'VERTICES':
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
  };

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
        // const vertex2 = vertices[(idx + 1) % vertices.length];
        const vertexIds = removePrefix(name, EDGE).split('__');
        const edgeVertices = vertices.reduce((newVertices, { id, x, y }) => {
          if (vertexIds.includes(id)) {
            newVertices.push({
              name: addPrefix(id, VERTEX),
              distance: translation({ x, y }, coordinates),
            });
          }

          return newVertices;
        }, []);

        switch (true) {
          case shiftKey:
            const selected = areVerticesSelected(edgeVertices);

            if (areAllVerticesSelected(edgeVertices)) {
              console.log('edgeDown all selected')
              removeSelectedVertices(vertexIds.map(name => addPrefix(name, VERTEX)));
            } else {
              console.log('edgeDown not all selected')
              addSelectedVertices(edgeVertices);
            }
            // const addVertices = edgeVertices.reduce((acc, vertex) => {
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
              setSelectedVertices(edgeVertices.reduce((vertices, { distance, name }) => {
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
        if (Object.keys(selectedVertices).length) {
          const updatedVertices = [];

          for (const name in selectedVertices) {
            const distance = selectedVertices[name];

            updatedVertices.push({
              id: removePrefix(name, VERTEX),
              x: pointerCoordinates.x + distance.x,
              y: pointerCoordinates.y + distance.y,
            });
          }

          dispatch(moveVertices(updatedVertices));
        }
    }

    event.stopPropagation();
  };

  const handlePointerMoveEdge = (event, pointer, coordinates) => {
    const {
      data: {
        originalEvent: {
          shiftKey = false,
        } = {},
      } = {},
    } = event;

    if (Object.keys(selectedVertices).length) {
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

    event.stopPropagation();
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
