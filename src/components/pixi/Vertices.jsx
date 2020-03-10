// components/pixi/Vertices.js
import React, { useCallback, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber';

import {
  addVertex,
  deleteVertex,
  moveVertex,
  moveVertices,
  startMoveVertex,
  stopMoveVertex,
} from 'actions/actions';
import Tools from 'constants/tools';

import Vertex from 'components/pixi/Vertex';
import { useScreenContext } from 'contexts/ScreenContext';

const VERTEX_PREFIX = 'VERTEX__';

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

const Vertices = ({
  active,
  height,
  width,
  scale,
  setCursor,
  ...restProps
}) => {
  const {
    altPressed,
    ctrlPressed,
    dispatch,
    tool,
    vertices,
  } = useScreenContext();

  // pointers currently interacting with the component.
  const [activePointers, setActivePointers] = useState([]);
  const [queuedSelectedVertices, setQueuedSelectedVertices] = useState([]);
  // vertices that have been selected by a pointer
  const [selectedVertices, setSelectedVertices] = useState([]);
  const [pointerVertexDistances, setPointerVertexDistances] = useState([]);
  const hitArea = new PIXI.Rectangle(0, 0, width, height);

  const handlePointerMove = event => {
    const {
      currentTarget: parent,
      data: { identifier },
      target,
    } = event;
    if (target.name && target.name.indexOf(VERTEX_PREFIX) === 0) {
      console.log('floog', selectedVertices)
      handleVertexPointerUp(event);
      console.log('floog', selectedVertices)
    }

    const [activePointer, activePointerIndex] = activePointers.reduce(
      (result, pointer, index) => pointer.identifier === identifier ? [pointer, index] : result,
      []
    );
    // vertices that have been selected by the event's identifier.
    const identifierSelectedVertices = selectedVertices.filter(vertex => vertex.identifier === identifier);
    const pointerCoordinates = event.data.getLocalPosition(parent);

    // the pointer is active (it must be though, since it's moving) and it has one or more vertex selected.
    if (activePointer && identifierSelectedVertices.length) {
      const updatedVertices = identifierSelectedVertices.map(({ distance, name }) => ({
        id: name.replace(VERTEX_PREFIX, ''),
        x: pointerCoordinates.x + distance.x,
        y: pointerCoordinates.y + distance.y,
      }));

      if (updatedVertices.length) {
        dispatch(moveVertices(updatedVertices));
      }

      setActivePointers(currentActivePointers => [
        ...currentActivePointers.slice(0, activePointerIndex),
        {
          coordinates: pointerCoordinates,
          identifier,
        },
        ...currentActivePointers.slice(activePointerIndex + 1),
      ]);
    }
  };

  /**
   * Adds a vertex to `queuedSelectedVertices` storing `name` and `identifier`.
   * @param {number} identifier  The `pointerId` attribute of a poitner event.
   * @param {number} name        The `name` attribute of of a PIXI.DisplayObject.
   */
  const queueSelectVertex = (identifier, name, distance) => setQueuedSelectedVertices(
    currentQueuedSelectedVertices => [
      ...currentQueuedSelectedVertices.filter(current => current.identifier !== identifier),
      { identifier, name, distance }
    ]
  );

  const toggleSelectVertex = (identifier, name, distance) => {
    const activeIndex = selectedVertices.findIndex(vertex => identifier === vertex.identifier && name === vertex.name);

    if (activeIndex >= 0) {
      // the vertex is selected, deselect it.
      setSelectedVertices([...selectedVertices.slice(0, activeIndex), ...selectedVertices.slice(activeIndex + 1)]);
    } else {
      // the vertex isn't selected, select it.
      setSelectedVertices(currentSelectedVertices => [...currentSelectedVertices, { identifier, name, distance }]);
    }
  };

  const updateDistances = (identifier, coordinates) => (
    setSelectedVertices(currentSelectedVertices => (
      currentSelectedVertices.map(vertex => {
        if (vertex.identifier === identifier) {
          const { x, y } = vertices.find(v => v.id === vertex.name.replace(VERTEX_PREFIX, ''));
          const distance = getDistance({ x, y }, coordinates);
          return { ...vertex, distance };
        }

        return { ...vertex };
      })
    ))
  );
  /**
   * handles pointerdown events on a vertex.
   */
  const handleVertexPointerDown = (event, coordinates) => {
    const altKey = event.data.originalEvent.altKey;
    const ctrlKey = event.data.originalEvent.ctrlKey;
    const shiftKey = event.data.originalEvent.shiftKey;

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
            toggleSelectVertex(
              event.data.identifier,
              event.target.name,
              getDistance(coordinates, event.target.position)
            );
            updateDistances(event.data.identifier, coordinates);
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
              event.data.identifier,
              event.target.name,
              getDistance(coordinates, event.target.position)
            );
            updateDistances(event.data.identifier, coordinates);
        }
    }
  };

  const handleVertexPointerUp = (event, replace=false) => {
    // find this vertex in the selection queue from a pointerdown
    const [queuedSelectedVertex, queuedSelectedVertexIndex] = queuedSelectedVertices.reduce(
      (result, vertex, index) => vertex.identifier === event.data.identifier ? [vertex, index] : result,
      []
    );

    // if the vertex is in the queue, make it the only selected and remove it from the queue.
    if (queuedSelectedVertex) {
      setSelectedVertices(
        currentSelectedVertices => replace ? [queuedSelectedVertex] : [...currentSelectedVertices, queuedSelectedVertexIndex]
      );
      // remove the vertex from the queue
      setQueuedSelectedVertices(
        currentQueuedSelectedVertices => [
          ...currentQueuedSelectedVertices.slice(0, queuedSelectedVertexIndex),
          ...currentQueuedSelectedVertices.slice(queuedSelectedVertexIndex + 1),
        ]
      );
    }
  };

  const handleVertexPointerMove = event => {
    handleVertexPointerUp(event);
    console.log('floog', 'handleVertexPointerMoves');
  };

  const handlePointerMoves = event => {
    const { target } = event;

     switch (true) {
      case target.name === 'VERTICES':
        // it's this component
        break;
      case target.name && target.name.indexOf(VERTEX_PREFIX) === 0:
        // it's a vertex
        handleVertexPointerMove(event);
        console.log('handling vertex tap')
        break;
      default:
        break;
     }
  };

  /**
   * Main pointertap, passes the event to more specific handlers.
   */
  const handlePointerTap = event => {
    const { target } = event;

     switch (true) {
      case target.name === 'VERTICES':
        // it's this component
        break;
      case target.name && target.name.indexOf(VERTEX_PREFIX) === 0:
        // it's a vertex
        console.log('handling vertex tap')
        break;
      default:
        break;
     }
  };

  /**
   * Main pointerdown, passes the event to more specific handlers.
   */
  const handlePointerDown = event => {
    const {
      currentTarget: parent,
      data: { identifier },
      target,
    } = event;
    const coordinates = event.data.getLocalPosition(parent);
    // the pointer that just touched down is now active.
    setActivePointers(currentActivePointers => [...currentActivePointers, { coordinates, identifier }]);

    switch (true) {
      case target.name === 'VERTICES':
        // it's this component
        break;
      case target.name && target.name.indexOf(VERTEX_PREFIX) === 0:
        // it's a vertex
        handleVertexPointerDown(event, coordinates);
        break;
      default:
        break;
    }
  };

  const handlePointerUp = event => {
    const {
      data: { identifier },
      target,
    } = event;

    // remove this pointer from active pointers. valid for VERTICES and all children.
    setActivePointers(currentActivePointers => currentActivePointers.filter(activePointer => activePointer.identifier !== identifier));

    switch (true) {
      case target.name === 'VERTICES':
        // it's this component
        break;
      case target.name && target.name.indexOf(VERTEX_PREFIX) === 0:
        // it's a vertex
        console.log('handling vertex pointer-up');
        handleVertexPointerUp(event, true);
        break;
      default:
        break;
    }
  };

  return(
    <Container
      name='VERTICES'
      hitArea={hitArea}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointermove={handlePointerMove}
      pointertap={handlePointerTap}
      {...restProps}
    >
      {vertices.map((vertex, idx) => {
        const { x, y, id } = vertex;
        const scaleRatio = [
          1 / scale.x,
          1 / scale.y,
        ];
        const props = {
          active,
          altPressed,
          ctrlPressed,
          id,
          scale: scaleRatio,
          setSelectedVertices,
          setCursor,
          selectedVertices,
          tool,
          x,
          y,
        };
        return <Vertex key={id} { ...props } />;
      })}
    </Container>
  );
};

Vertices.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  setCursor: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number,
};

Vertices.defaultProps = {
  scale: { x: 1, y: 1 },
  setCursor: () => {},
  height: 0,
  width: 0,
};

export default Vertices;
