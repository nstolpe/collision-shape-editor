// src/js/components/html/containers/PointerCoordinates.js
import React from 'react';

import RootContext from 'Contexts/RootContext';
import withSelector from 'Components/hoc/withSelector';
import ValueMonitor from 'Components/html/ValueMonitor';

const selector = ({ pointerCoordinates }) => ({
  x: pointerCoordinates.x,
  y: pointerCoordinates.y,
});

const PointerCoordinates = ({ x, y, ...props }) => {
  const values = [
    {
      label: 'x',
      value: x ?? '--',
      disabled: true,
    },
    {
      label: 'y',
      value: y ?? '--',
      disabled: true,
    },
  ];

  return (
    <ValueMonitor
      title="pointer coordinates"
      values={values}
      name="pointer"
      {...props}
    />
  );
};
export default withSelector(RootContext, selector)(PointerCoordinates);
