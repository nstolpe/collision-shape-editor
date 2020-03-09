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

const getDistance = (pointA, pointB) => {
    const { aX, aY } = Array.isArray(pointA) ? { x: pointA[0], y: pointA[1] } :
        typeof pointA === 'object' ? pointA :
        { x:0, y: 0 };
    const { bX, bY } = Array.isArray(pointB) ? { x: pointB[0], y: pointB[1] } :
        typeof pointB === 'object' ? pointB :
        { x:0, y: 0 };

    return {
      x: aX - bX,
      Y: aY - bY,
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
  const [lastMove, setLastMove] = useState(0);
  const [identifierVertices, setIdentifierVertices] = useState(0);
  const hitArea = new PIXI.Rectangle(0, 0, width, height);

  const handlePointerMove = event => {
    const {
      currentTarget: parent,
      data: { identifier },
    } = event;
    const activePointer = activePointers.find(activePointer => activePointer.identifier === identifier);
    const pointerCoordinates = event.data.getLocalPosition(parent);
    // vertices that have been selected by the event's identifier.
    const identifierVertices = selectedVertices.filter(vertex => vertex.identifier === identifier);
    const now = Date.now();
    const elapsed = now - lastMove;

    if (activePointer && identifierVertices.length && elapsed > 100) {
      setLastMove(now);
      const activePointerIndex = activePointers.indexOf(activePointer);
      const distances = {
        x: pointerCoordinates.x - activePointer.coordinates.x,
        y: pointerCoordinates.y - activePointer.coordinates.y,
      };
      const updatedVertices = [];

      for (let i = 0, l = identifierVertices.length; i < l; i++) {
        const { name } = identifierVertices[i];
        const { x, y } = vertices.find(vertex => vertex.id === name.replace('VERTEX__', ''));

        updatedVertices.push({
          id: name.replace('VERTEX__', ''),
          x: x + distances.x,
          y: y + distances.y,
        });
      }

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
   * Adds a vertice to `queuedSelectedVertices` storing `name` and `identifier`.
   * @param {number} identifier  The `pointerId` attribute of a poitner event.
   * @param {number} name        The `name` attribute of of a PIXI.DisplayObject.
   */
  const queueSelectVertex = (identifier, name) => {
    setQueuedSelectedVertices(currentQueuedSelectedVertices => [ ...currentQueuedSelectedVertices, { identifier, name }]);
  };

  /**
   * Replaces all selectedVertices with the one with `name` in a selector group for `identifier`.
   * @param {number} identifier  The `pointerId` attribute of a poitner event.
   * @param {number} name        The `name` attribute of of a PIXI.DisplayObject.
   */
  const selectVertex = (identifier, name) => {
    setSelectedVertices([{ identifier, name }]);
  };

  const toggleSelectVertex = (identifier, name) => {
    const activeIndex = selectedVertices.findIndex(vertex => identifier === vertex.identifier && name === vertex.name);

    if (activeIndex >= 0) {
      // the vertex is selected, deselect it.
      setSelectedVertices([...selectedVertices.slice(0, activeIndex), ...selectedVertices.slice(activeIndex + 1)]);
    } else {
      // the vertex isn't selected, select it.
      setSelectedVertices(currentActiveVertices => [...currentActiveVertices, { identifier, name }]);
    }
  };

  const handlerVertexPointerDown = event => {
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
            toggleSelectVertex(event.data.identifier, event.target.name);
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
            queueSelectVertex(event.data.identifier, event.target.name);
        }
    }
  };

  const handlerVertexPointerUp = event => {
    // find this vertex in the selection queue from a pointerdown
    const [queuedSelectedVertex, queuedSelectedVertexIndex] = queuedSelectedVertices.reduce(
      (result, vertex, index) => vertex.identifier === event.data.identifier ? [vertex, index] : result,
      []
    );

    // if the vertex is in the queue, move it to existing and
    if (queuedSelectedVertex) {
      const existingSelectedVertex = selectedVertices.find(vertex => vertex.identifier === event.data.identifier);

      setSelectedVertices(currentSelectedVertices => [queuedSelectedVertex]);
      // remove the vertex from the queue
      setQueuedSelectedVertices(
        currentQueuedSelectedVertices => [
          ...currentQueuedSelectedVertices.slice(0, queuedSelectedVertexIndex),
          ...currentQueuedSelectedVertices.slice(queuedSelectedVertexIndex + 1),
        ]
      );
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
      case target.name && target.name.indexOf('VERTEX__') === 0:
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
    setActivePointers(currentActivePointers => [...currentActivePointers, { coordinates, identifier }]);
    console.log('hello friend', event.target, event.currentTarget)

    switch (true) {
      case target.name === 'VERTICES':
        // it's this component
        break;
      case target.name && target.name.indexOf('VERTEX__') === 0:
        // it's a vertex
        console.log('handling vertex pointer-down');
        handlerVertexPointerDown(event);
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
      case target.name && target.name.indexOf('VERTEX__') === 0:
        // it's a vertex
        console.log('handling vertex pointer-up');
        handlerVertexPointerUp(event);
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
