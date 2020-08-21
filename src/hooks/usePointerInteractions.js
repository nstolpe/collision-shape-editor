// hooks/usePointerInteractions.js
import { useReducer, useState } from 'react';

import { moveVertices } from 'actions/actions';
import Tools from 'constants/tools';
import { useScreenContext } from 'contexts/ScreenContext';
import { property, properties } from 'tools/property';
import { VERTEX } from 'constants/type-prefixes';

const VERTEX_PREFIX = 'VERTEX__';

const initialState = {
  pointers: [],
  selectedVertices: [],
  selectedVerticesQueue: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case '':
    default:
      console.log(action.type);
  }
};

const usePointerInteraction = () => {
   const {
     dispatch,
     tool,
     vertices,
   } = useScreenContext();
  // pointers currently interacting with the component.
  // pointer = { coordinates: { x: number, y: number }, identifier: number, target: PIXI.DisplayObject, }
  const [activePointers, setActivePointers] = useState([]);
  // queued selected vertices = { name: string, distance: { x: number, y: number} }
  const [selectedVerticesQueue, setSelectedVerticesQueue] = useState([]);
  // vertices that have been selected by a pointer. same structure as queued selected vertices
  const [selectedVertices, setSelectedVertices] = useState([]);


  /**************************************************************************************
   * utility functions                                                                  *
   **************************************************************************************/

  /**
   * Adds a vertex to `selectedVerticesQueue` storing `name` and `identifier`.
   * @param {number} name        The `name` attribute of of a PIXI.DisplayObject.
   */
  const queueSelectVertex = (name, distance) => setSelectedVerticesQueue(
    currentQueuedSelectedVertices => [
      ...currentQueuedSelectedVertices,
      { name, distance }
    ]
  );

  const addSelectedVertex = (name, distance) => {
    setSelectedVertices(
      currentSelectedVertices => [...currentSelectedVertices, { name, distance }]
    );
  };

  const removeSelectedVertex = name => {
    const index = selectedVertices.findIndex(vertex => name === vertex.name);

    setSelectedVertices(currentSelectedVertices =>
      [...currentSelectedVertices.slice(0, index), ...currentSelectedVertices.slice(index + 1)]
    );
  };

  const toggleSelectVertex = (identifier, name, distance) => {
    const vertexIndex = selectedVertices.findIndex(vertex => name === vertex.name);
    if (vertexIndex >= 0) {
      // the vertex was found, so it's selected. deselect it.
      setSelectedVertices(currentSelectedVertices =>
        [...currentSelectedVertices.slice(0, vertexIndex), ...currentSelectedVertices.slice(vertexIndex + 1)]
      );
    } else {
      // the vertex wasn't found, so it's not selected. select it.
      setSelectedVertices(currentSelectedVertices => ([...currentSelectedVertices, { name, distance }]));
    }
  };

  const getDistance = (pointA, pointB) => {
      const { x: aX, y: aY } = Array.isArray(pointA) ? { x: pointA[0], y: pointA[1] } :
          typeof pointA === 'object' ? pointA :
          { x:0, y: 0 };
      const { x: bX, y: bY } = Array.isArray(pointB) ? { x: pointB[0], y: pointB[1] } :
          typeof pointB === 'object' ? pointB :
          { x:0, y: 0 };

      return {
        x: aX - bX,
        y: aY - bY,
      };
  };

  const updateDistances = (identifier, coordinates) => (
    setSelectedVertices(currentSelectedVertices => (
      currentSelectedVertices.map(vertex => {
        const { x, y } = vertices.find(v => v.id === vertex.name.replace(VERTEX_PREFIX, ''));
        const distance = getDistance({ x, y }, coordinates);
        return { ...vertex, distance };
      })
    ))
  );
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
      case target.name && target.name.indexOf(VERTEX_PREFIX) === 0:
        // it's a vertex
        handlePointerDownVertex(event, coordinates);
        break;
      default:
        break;
    }
  };

  /**
   * Main pointermove, covers a large variety of interactions.
   */
  const handlePointerMove = event => {
    const { data: { identifier } } = event;
    const [activePointer, activePointerIndex] = activePointers.reduce(
      (result, pointer, index) => pointer.identifier === identifier ? [pointer, index] : result,
      []
    );
    const pointerCoordinates = event.data.getLocalPosition(event.target.parent);

    if (!activePointer) {
      // no pointer is down
      return;
    }

    // update pointerCoordinates of the active pointer.
    setActivePointers(currentActivePointers => [
      ...currentActivePointers.slice(0, activePointerIndex),
      {
        ...activePointer,
        coordinates: pointerCoordinates,
      },
      ...currentActivePointers.slice(activePointerIndex + 1),
    ]);

    switch (true) {
     // case event.target.name === 'VERTICES':
     case activePointer.target.name === 'VERTICES':
      // the active pointer's target is the vertices container.
      break;
     case activePointer.target.name && activePointer.target.name.indexOf(VERTEX_PREFIX) === 0:
      // the active pointer's cached target from pointerdown is a vertex.
      handlePointerMoveVertex(event, activePointer, pointerCoordinates);
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
      target,
    } = event;
    const pointer = activePointers.find(activePointer => activePointer.identifier === identifier);
    const name = property(pointer, 'target.name');

    switch (true) {
      case name === 'VERTICES':
        // it's this component
        break;
      case !!name && `${target.name}`.indexOf(VERTEX_PREFIX) === 0:
        // it's a vertex
        handlePointerUpVertex(event);
        break;
      default:
        break;
    }

    // remove this pointer from active pointers. valid for VERTICES and all children.
    setActivePointers(currentActivePointers => currentActivePointers.filter(activePointer => activePointer.identifier !== identifier));
  };

  const handlePointerDownVertex = (event, coordinates) => {
    const eventMaps = [
      {
        map: ['data', 'originalEvent', 'altKey'],
        default: false,
      },
      {
        map: ['data', 'originalEvent', 'ctrlKey'],
        default: false,
      },
      {
        map: ['data', 'originalEvent', 'shiftKey'],
        default: false,
      },
      ['data', 'identifier'],
      ['target', 'name'],
    ];
    const {
      altKey,
      ctrlKey,
      shiftKey,
      identifier,
      name,
    } = properties(event, eventMaps);

    updateDistances(identifier, coordinates);

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
            const isVertexSelected = !!selectedVertices.find(vertex => vertex.name === event.target.name);

            if (isVertexSelected) {
              removeSelectedVertex(event.target.name);
              setActivePointers(currentActivePointers =>
                currentActivePointers.filter(
                  activePointer => activePointer.identifier !== identifier
                )
              );
            } else {
              addSelectedVertex(event.target.name, getDistance(coordinates, event.target.position))
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
            queueSelectVertex(
              event.target.name,
              getDistance(coordinates, event.target.position)
            );
        }
    }
  };

  const handlePointerMoveVertex = (event, activePointer, pointerCoordinates) => {
    const shiftKey = property(event, 'data.originalEvent.shiftKey', false);
    event.stopPropagation();

    switch (true) {
      // case shiftKey:
      //   break;
      default:
        const updatedVertices = selectedVertices.map(({ distance, name }) => ({
          id: name.replace(VERTEX_PREFIX, ''),
          x: pointerCoordinates.x + distance.x,
          y: pointerCoordinates.y + distance.y,
        }));
        // is the vertex already selected?
        const isVertexSelected = !!selectedVertices.find(vertex => vertex.name === event.target.name);
        // get the vertex and index from select queue.
        const [queuedSelectedVertex, queuedSelectedVertexIndex] = selectedVerticesQueue.reduce(
          (result, vertex, index) => vertex.name === activePointer.target.name ? [vertex, index] : result,
          []
        );

        // remove the vertex from the select queue.
        if (queuedSelectedVertexIndex || queuedSelectedVertexIndex === 0) {
          setSelectedVerticesQueue(
            currentQueuedSelectedVertices => currentQueuedSelectedVertices.filter(
              (vertex, index) => index !== queuedSelectedVertexIndex
            )
          );
        }

        // if the vertex is in the queue and isn't already selected, add it to the selection
        if (queuedSelectedVertex && !isVertexSelected) {
          if (selectedVertices.length) {
            setSelectedVertices([queuedSelectedVertex]);
          } else {
            setSelectedVertices(currentSelectedVertices => [...currentSelectedVertices, queuedSelectedVertex]);
          }
        }

        // if any vertices have been updated, set the state.
        if (updatedVertices.length) {
          dispatch(moveVertices(updatedVertices));
        }
    }
  };

  const handlePointerUpVertex = event => {
    const shiftKey = property(event, 'data.originalEvent.shiftKey', false);
    const pointer = activePointers.find(activePointer => activePointer.identifier === property(event, 'data.identifier'));

    switch (true) {
      case shiftKey:
        break
      default:
        // find this vertex in the selection queue from a pointerdown
        const [queuedSelectedVertex, queuedSelectedVertexIndex] = selectedVerticesQueue.reduce(
          (result, vertex, index) => vertex.name === event.target.name ? [vertex, index] : result,
          []
        );

        // if the vertex is in the queue, make it the only selected and remove it from the queue.
        if (queuedSelectedVertex) {
          setSelectedVertices([queuedSelectedVertex]);
          // remove the vertex from the queue
          setSelectedVerticesQueue(
            currentQueuedSelectedVertices => currentQueuedSelectedVertices.filter(
              (vertex, index) => index !== queuedSelectedVertexIndex
            )
            // currentQueuedSelectedVertices => [
            //   ...currentQueuedSelectedVertices.slice(0, queuedSelectedVertexIndex),
            //   ...currentQueuedSelectedVertices.slice(queuedSelectedVertexIndex + 1),
            // ]
          );
        }
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
