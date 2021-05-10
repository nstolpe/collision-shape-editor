// components/pixi/Vertex.js
import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Circle from 'components/pixi/base/Circle';
import {
  CELL,
  DEFAULT,
  MOVE,
  NOT_ALLOWED,
} from 'constants/cursors';
import * as Tools from 'constants/tools';

export const getCursor = tool => {
  switch (tool) {
    case Tools.ADD:
      return CELL;
    case Tools.DELETE:
      return NOT_ALLOWED;
    case Tools.SELECT:
      return MOVE;
    default:
      return DEFAULT;
  }
};

const Vertex = ({
  activeFill,
  alpha,
  fill,
  hitArea,
  id,
  radius,
  scale,
  selected,
  strokeAlignment,
  strokeColor,
  strokeWidth,
  tool,
  x,
  y,
}) => (
  <Circle
    alpha={alpha}
    buttonMode
    cursor={getCursor(tool)}
    // fill={selectedVertices.find(vertex => vertex.name === `VERTEX__${id}`) ? activeFill : fill}
    fill={selected ? activeFill : fill}
    hitArea={hitArea}
    interactive={true}
    name={id}
    pivot={[0, 0]}
    radius={radius}
    scale={scale}
    x={x}
    y={y}
    strokeAlignment={strokeAlignment}
    strokeColor={strokeColor}
    strokeWidth={strokeWidth}
  />
);

Vertex.defaultProps = {
  activeFill: 0x17bafb,
  alpha: 1,
  fill: 0xe62bdc,
  hitArea: new PIXI.Circle(0, 0, 5.5),
  id: 'ID',
  radius: 4.5,
  scale: [1,1],
  selected: false,
  strokeAlignment: 1,
  strokeColor: 0xffffff,
  strokeWidth: 2,
  tool: Tools.SELECT,
  x: 0,
  y: 0,
};

Vertex.propTypes = {
  activeFill: PropTypes.number,
  alpha: PropTypes.number,
  fill: PropTypes.number,
  hitArea: PropTypes.object,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  radius: PropTypes.number,
  scale: PropTypes.oneOfType([
    PropTypes.number,
    (props, propName, componentName) => {
      const prop = props[propName];
      if (
        !Array.isArray(prop) ||
        prop.length !== 2 ||
        prop.find(isNaN)
      ) {
        console.log(prop);
        return new Error(
          `Invalid prop \`${propName}\` supplied to \`${componentName}\`, expected array of two numbers.`
        );
      }
    },
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ]),
  selected: PropTypes.bool,
  strokeAlignment: PropTypes.number,
  strokeColor: PropTypes.number,
  strokeWidth: PropTypes.number,
  tool: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
};

const comparator = ({ scale, ...restProps}, { scale: oldScale, ...restOldProps }) => {
  if (
    (scale?.x ?? scale?.[0] ?? scale) !== (oldScale?.x ?? oldScale?.[0] ?? oldScale) ||
    (scale?.y ?? scale?.[1] ?? scale) !== (oldScale?.y ?? oldScale?.[1] ?? oldScale)
  ) {
    return false;
  }

  const keys = Object.keys(restProps);

  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];

    if (restProps[key] !== restOldProps[key]) {
      return false;
    }
  }

  return true;
};

export default React.memo(Vertex, comparator);
