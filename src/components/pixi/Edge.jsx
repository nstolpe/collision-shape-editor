// src/components/pixi/Edge.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Rectangle from 'Components/pixi/base/Rectangle';
import * as Cursors from 'Constants/cursors';
import * as Tools from 'Constants/tools';

export const getCursor = (tool) => {
  switch (tool) {
    case Tools.ADD:
      return Cursors.CELL;
    case Tools.DELETE:
      return Cursors.NOT_ALLOWED;
    case Tools.SELECT:
      return Cursors.MOVE;
    default:
      return Cursors.DEFAULT;
  }
};

const Edge = React.forwardRef(
  (
    {
      activeFill,
      fill,
      id,
      length,
      rotation,
      scale,
      selected,
      thickness,
      tool,
      x,
      y,
    },
    ref
  ) => {
    const [pivot, setPivot] = useState({ x: 0, y: thickness * 0.5 });
    const [hitArea, setHitArea] = useState(
      new PIXI.Rectangle(0, -2, length, thickness + 4)
    );

    useEffect(() => {
      setPivot({ x: 0, y: thickness * 0.5 });
      setHitArea(new PIXI.Rectangle(0, -2, length, thickness + 4));
    }, [length, thickness]);

    return (
      <Rectangle
        cursor={getCursor(tool)}
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
  }
);

Edge.propTypes = {
  activeFill: PropTypes.number,
  fill: PropTypes.number,
  length: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  thickness: PropTypes.number,
  tool: PropTypes.string,
};

Edge.defaultProps = {
  activeFill: 0x17bafb,
  fill: 0xff3e82,
  selected: false,
  thickness: 1,
  tool: Cursors.DEFAULT,
};

export default Edge;
