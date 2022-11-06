// src/components/pixi/Shapes.jsx
import React from 'react';

import withSelector from 'Components/hoc/withSelector';
import Shape from 'Components/pixi/Shape';
import ScreenContext from 'Contexts/ScreenContext';
import { SHAPE } from 'Constants/prefixes';
import { addPrefix } from 'Utility/prefix';
import selectedVerticesComparator from 'Comparators/selected-vertices';

const selector = ({ selectedVertices, shapes }) => ({
  selectedVertices,
  shapes,
});
const comparator = (
  { selectedVertices, shapes },
  { shapes: oldShapes, selectedVertices: oldSelectedVertices }
) => {
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
