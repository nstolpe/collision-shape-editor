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
  fill,
  hitArea,
  id,
  setCursor,
  setSelectedVertices,
  selectedVertices,
  tool,
  x,
  y,
  ...restProps
}) => (
  <Circle
    name={`VERTEX__${id}`}
    fill={selectedVertices.find(vertex => vertex.name === `VERTEX__${id}`) ? activeFill : fill}
    interactive={true}
    buttonMode
    cursor={getCursor(tool)}
    hitArea={hitArea}
    x={x}
    y={y}
    pivot={{x: 0, y: 0}}
    {...restProps}
  />
);

Vertex.defaultProps = {
  activeFill: 0x17bafb,
  alpha: 1,
  radius: 4.5,
  fill: 0xe62bdc,
  strokeColor: 0xffffff,
  strokeWidth: 2,
  strokeAlignment: 1,
  hitArea:new PIXI.Circle(0, 0, 5.5)
};

Vertex.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  // active: PropTypes.bool,
  activeFill: PropTypes.number,
  alpha: PropTypes.number,
  radius: PropTypes.number,
  fill: PropTypes.number,
  strokeColor: PropTypes.number,
  strokeWidth: PropTypes.number,
  strokeAlignment: PropTypes.number,
};

export default Vertex;
