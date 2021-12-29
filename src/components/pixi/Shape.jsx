// src/components/pixi/Shape.jsx
import { useState } from 'react';

import { SHAPE, VERTEX } from 'constants/prefixes';
import { addPrefix } from 'tools/prefix';
import Geometry from 'components/pixi/Geometry';

const Shape = ({
  vertices,
  selectedVertices,
  closed,
  id,
}) => {
  // const selected = Array.from(vertices.entries()).reduce(
  //   (result, [idx, key, vertex]) => selectedVertices.hasOwnProperty(addPrefix(key, VERTEX)) || result,
  //   false
  // );
  // console.log(selected);
  // console.log('selectedVertices', selectedVertices);
  return (
    <Geometry
      selectedVertices={selectedVertices}
      vertices={vertices}
      closed={closed}
      name={addPrefix(id, SHAPE)}
    />
  );
};

export default Shape;
