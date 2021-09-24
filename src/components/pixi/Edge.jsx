// src/components/pixi/Edge.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Rectangle from 'components/pixi/base/Rectangle';

const Edge = React.forwardRef(({
  activeFill,
  fill,
  id,
  length,
  rotation,
  scale,
  selected,
  thickness,
  x,
  y,
}, ref) => {
  const [pivot, setPivot] = useState([0, thickness * 0.5]);
  const [hitArea, setHitArea] = useState(new PIXI.Rectangle(0, -2, length, thickness + 4));

  useEffect(() => {
    setPivot([0, thickness * 0.5]);
    setHitArea(new PIXI.Rectangle(0, -2, length, thickness + 4));
  }, [length, thickness]);

  return (
    <Rectangle
      cursor='move'
      fill={selected ? activeFill : fill}
      height={thickness}
      hitArea={hitArea}
      interactive
      name={id}
      pivot={pivot}
      ref={ref}
      rotation={rotation}
      scale={scale}
      width={length}
      x={x}
      y={y}
    />
  );
});

Edge.propTypes = {
  activeFill: PropTypes.number,
  fill: PropTypes.number,
  length: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  thickness: PropTypes.number,
};

Edge.defaultProps = {
  activeFill: 0x17bafb,
  fill: 0xff3e82,
  selected: false,
  thickness: 1,
};

export default Edge;
