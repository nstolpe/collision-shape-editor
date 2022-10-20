// src/js/components/html/containers/SelectCoordinates.js
import restComparator from 'comparators/rest';
import selectedVerticesComparator from 'comparators/selected-vertices';
import withSelector from 'components/hoc/withSelector';
import ValueMonitor from 'components/html/ValueMonitor';
import RootContext from 'contexts/RootContext';
import { DEFAULT_DELIMITER } from 'tools/prefix';
import { expandAABB } from 'tools/math';
import { recenterSelectedVertices } from 'actions/actions';

const selector = ({
  dispatch,
  selectedVertices,
  shapes,
}) => ({
  dispatch,
  selectedVertices,
  shapes,
});

const comparator = (
  {
    selectedVertices,
    ...props
  },
  {
    selectedVertices: oldSelectedVertices,
    ...oldProps
  },
) => {
  if (!selectedVerticesComparator(selectedVertices, oldSelectedVertices)) {
    return false;
  }

  // @TODO compare shapes. or make sure they change whenever a vertex does (i think they already do).
  if (!restComparator(props, oldProps)) {
    return false;
  }

  return true;
};

const SelectCoordinates = ({ dispatch, selectedVertices, shapes, ...props }) => {
  const selectedVertexKeys = Object.keys(selectedVertices);
  let values;

  if (selectedVertexKeys.length) {
    const [minX, maxX, minY, maxY] = selectedVertexKeys.reduce((bounds, key) => {
      const [, vertexKey,, shapeKey] = key.split(DEFAULT_DELIMITER);
      const shape = shapes.key(shapeKey);
      const vertex = shape.vertices.key(vertexKey);
      const { x, y } = vertex;

      return expandAABB(x, y, bounds[0], bounds[1], bounds[2], bounds[3]);
    }, [Infinity, -Infinity, Infinity, -Infinity]);
    const center = {
      x: minX + ((maxX - minX) * 0.5),
      y: minY + ((maxY - minY) * 0.5),
    };

    values = [
      {
        type: 'number',
        label: 'x',
        value: center.x,
        disabled: false,
        step: 1,
        onChange: e => {
          dispatch(recenterSelectedVertices(+e.target.value, center.y));
        },
      },
      {
        type: 'number',
        label: 'y',
        value: center.y,
        disabled: false,
        step: 1,
        onChange: e => {
          dispatch(recenterSelectedVertices(center.x, +e.target.value));
        },
      },
    ];
  } else {
    values = [
      {
        type: 'text',
        label: 'x',
        value: '--',
        disabled: true,
      },
      {
        type: 'text',
        label: 'y',
        value: '--',
        disabled: true,
      },
    ];
  }
  return (
    <ValueMonitor
      title="selection center coordinates"
      values={values}
      name="select"
      {...props}
    />
  );
};

export default withSelector(RootContext, selector, comparator)(SelectCoordinates);
