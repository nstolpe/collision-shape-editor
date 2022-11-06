// src/components/pixi/Shape.jsx
import React, { useState } from 'react';

import { SHAPE, VERTEX } from 'Constants/prefixes';
import { addPrefix } from 'Utility/prefix';
import Geometry from 'Components/pixi/Geometry';

// @TODO add container to use selector and comparator
const Shape = ({
  vertices,
  selectedVertices,
  closed,
  showWinding,
  index,
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
      name={addPrefix(SHAPE, id)}
      index={index}
      showWinding={showWinding}
    />
  );
};

export default Shape;
