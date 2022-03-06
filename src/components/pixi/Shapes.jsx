// src/components/pixi/Shapes.jsx

import withSelector from 'components/hoc/withSelector';
import Shape from 'components/pixi/Shape';
import ScreenContext from 'contexts/ScreenContext';
import { SHAPE } from 'constants/prefixes';
import { addPrefix } from 'tools/prefix';

const selector = ({ shapes }) => ({ shapes });
const comparator = ({ shapes }, { shapes: oldShapes }) => {
  return oldShapes === shapes;
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
