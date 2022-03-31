// src/js/components/html/containers/SelectCoordinates.js
import RootContext from 'contexts/RootContext';
import withSelector from 'components/hoc/withSelector';
import ValueMonitor from 'components/html/ValueMonitor';

const selector = ({ pointerCoordinates }) => ({
  x: pointerCoordinates.x,
  y: pointerCoordinates.y,
});

const SelectCoordinates = ({ x, y, ...props }) => {
  const values = [
    {
      label: 'x',
      value: x,
      disabled: true,
    },
    {
      label: 'y',
      value: y,
      disabled: true,
    },
  ];

  return (
    <ValueMonitor
      title="selection center coordinates"
      values={values}
      name="select"
      {...props}
    />
  );
};
export default withSelector(RootContext, selector)(SelectCoordinates);
