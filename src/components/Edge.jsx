// src/components/Edge.jsx
import React from 'react';
import PropTypes from 'prop-types';

import Rectangle from 'components/base/Rectangle';

const Edge = ({
  fill,
  length,
  rotation,
  setCursor,
  thickness,
  x,
  y,
}) => {
  return (
    <Rectangle
      fill={fill}
      interactive
      cursor='move'
      pointerdown={e => console.log(e)}
      x={x}
      y={y}
      width={length}
      height={thickness}
      rotation={rotation}
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
  thickness: 1
};

export default Edge;
