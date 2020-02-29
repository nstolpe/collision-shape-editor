// src/components/pixi/Edge.jsx
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Rectangle from 'components/pixi/base/Rectangle';
import { useScreenContext } from 'contexts/ScreenContext';

const Edge = ({
  fill,
  length,
  position,
  rotation,
  setCursor,
  thickness,
  x,
  y,
}) => {
  const {
    dispatch,
  } = useScreenContext();
  const [currentPosition, setCurrentPosition] = useState([x, y]);
  const [lastPosition, setLastPosition] = useState([x, y]);

//   const pointerdown = event => {
//     setCursor(move);
//     if (!movingVertices.find(vertex => vertex.id === event.currentTarget.id && vertex.identifier === event.data.identifier) && event.currentTarget.id === id) {
//       const coordinates = event.data.getLocalPosition(event.currentTarget.parent);
//       setMovingVertices(
//         ids => [...ids, { id, coordinates, identifier: event.data.identifier }]
//       );
//     }
//   };
//
//   const pointerup = event => {
//     event.stopPropagation();
//     const coordinates = event.data.getLocalPosition(event.currentTarget.parent);
//     setCursor(grab);
//
//     if (movingVertices.find(vertex => vertex.id === event.currentTarget.id) && event.currentTarget.id === id) {
//       dispatch(moveVertex({ ...coordinates, id }));
//     }
//
//     setMovingVertices(currentMovingVertices => currentMovingVertices.filter(activeVertex => activeVertex.id !== id));
//   };
//
//   const pointerupoutside = event => {
//     event.stopPropagation();
//     setMovingVertices(currentMovingVertices => currentMovingVertices.filter(activeVertex => activeVertex.id !== id));
//   };

  return (
    <Rectangle
      fill={fill}
      interactive
      cursor='move'
      pointerdown={e => console.log(e)}
      x={x}
      y={y}
      pivot={[length * 0.5, thickness * 0.5]}
      width={length}
      height={thickness}
      position={position}
      rotation={rotation}
      hitArea={new PIXI.Rectangle(0, -2, length, thickness + 4)}
    />
  );
};

Edge.propTypes = {
  fill: PropTypes.number,
  length: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  thickness: PropTypes.number,
  setCursor: PropTypes.func,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

Edge.defaultProps = {
  fill: 0xff3e82,
  setCursor: () => {},
  thickness: 1,
};

export default Edge;
