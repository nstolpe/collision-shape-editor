// src/components/pixi/Shapes.jsx

import withSelector from 'components/hoc/withSelector';
import Shape from 'components/pixi/Shape';
import ScreenContext from 'contexts/ScreenContext';
import { SHAPE } from 'constants/prefixes';
import { addPrefix } from 'tools/prefix';
import selectedVerticesComparator from 'comparators/selected-vertices';

const selector = ({ selectedVertices, shapes }) => ({ selectedVertices, shapes });
const comparator = ({
  selectedVertices,
  shapes,
}, {
  shapes: oldShapes,
  selectedVertices: oldSelectedVertices,
}) => {
//   if (!selectedVerticesComparator(selectedVertices, oldSelectedVertices)) {
//     return false;
//   }
//
//   return oldShapes === shapes;
   return (
     selectedVerticesComparator(selectedVertices, oldSelectedVertices) &&
     oldShapes === shapes
   );
};

const Shapes = ({ shapes, selectedVertices }) =>
  shapes.map(({ vertices, closed, showWinding }, index, key) => (
    <Shape
      key={key}
      id={key}
      index={index}
      vertices={vertices}
      selectedVertices={selectedVertices}
      closed={closed}
      showWinding={showWinding}
    />
  ));

export default withSelector(ScreenContext, selector, comparator)(Shapes);
