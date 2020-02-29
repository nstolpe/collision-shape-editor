// src/js/base/components/pixi/Rectangle.js
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Drawing from 'components/pixi/base/Drawing';

export const draw = (instance, oldProps, newProps) => {
  const {
    fill,
    width,
    height,
    strokeAlignment,
    strokeAlpha,
    strokeColor,
    strokeWidth,
    ...newPropsRest
  } = newProps;

  const {
    fill: oldFill,
    width: oldWidth,
    height: oldHeight,
    strokeAlignment: oldStrokeAlignment,
    strokeAlpha: oldStrokeAlpha,
    strokeColor: oldStrokeColor,
    strokeWidth: oldStrokeWidth,
    ...oldPropsRest
  } = oldProps || {};

  instance.lineStyle(strokeWidth, strokeColor, strokeAlpha, strokeAlignment);
  instance.beginFill(fill);
  instance.drawRect(0, 0, width, height);
  instance.endFill();

  return [oldPropsRest, newPropsRest];
};

// forward the ref expose underlying PIXI.Graphics
const Rectangle = forwardRef((props, ref) => <Drawing {...props} ref={ref} />);

Rectangle.propTypes = {
  draw: PropTypes.func,
  fill: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  strokeAlignment: PropTypes.number,
  strokeAlpha: PropTypes.number,
  strokeColor: PropTypes.number,
  strokeWidth: PropTypes.number,
};

Rectangle.defaultProps = {
  draw,
  fill: 0xffffff,
  width: 0,
  height: 0,
  strokeAlignment: 0,
  strokeAlpha: 1.0,
  strokeColor: 0x000000,
  strokeWidth: 0,
};

export default Rectangle;
