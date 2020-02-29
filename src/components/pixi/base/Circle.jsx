// src/js/components/pixi/base/Circle.js
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types'

import Drawing from 'components/pixi/base/Drawing';

export const draw = (instance, oldProps, newProps) => {
  const {
    fill,
    strokeAlignment,
    strokeAlpha,
    strokeColor,
    strokeWidth,
    radius,
    ...newPropsRest
  } = newProps;

  const {
    fill: oldFill,
    radius: oldRadius,
    strokeAlignment: oldStrokeAlignment,
    strokeAlpha: oldStrokeAlpha,
    strokeColor: oldStrokeColor,
    strokeWidth: oldStrokeWidth,
    ...oldPropsRest
  } = oldProps || {};

  instance.lineStyle(strokeWidth, strokeColor, strokeAlpha, strokeAlignment);
  instance.beginFill(fill);
  instance.drawCircle(0, 0, radius);
  instance.endFill();

  return [oldPropsRest, newPropsRest];
};

// forward the ref expose underlying PIXI.Graphics
const Circle = forwardRef((props, ref) => <Drawing {...props} ref={ref} />);

Circle.propTypes = {
  draw: PropTypes.func,
  fill: PropTypes.number,
  radius: PropTypes.number,
  strokeAlignment: PropTypes.number,
  strokeAlpha: PropTypes.number,
  strokeColor: PropTypes.number,
  strokeWidth: PropTypes.number,
};

Circle.defaultProps = {
  draw,
  fill: 0xffffff,
  radius: 0,
  strokeAlignment: 0,
  strokeAlpha: 1.0,
  strokeColor: 0x000000,
  strokeWidth: 0,
};

export default Circle;
