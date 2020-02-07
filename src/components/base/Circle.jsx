// src/js/components/base/Circle.js
import React from 'react';
import PropTypes from 'prop-types'

import Drawing from 'components/base/Drawing';

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

const Circle = props => (<Drawing {...props} />);

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
