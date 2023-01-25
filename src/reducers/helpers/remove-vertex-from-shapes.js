// src/reducers/helpers/remove-vertex-from-shapes.js
import { keySelector } from 'Selectors/keys';
import List from 'Utility/List';
import { DEFAULT_DELIMITER } from 'Utility/prefix';

// delete a shape.
const deleteShape = (state, { key }) => {
  const { shapes } = state;
  const [, , , shapeKey] = key.split(DEFAULT_DELIMITER);
  const newShapes = shapes.splice({
    start: shapes.indexOfKey(shapeKey),
    deleteCount: 1,
  });

  return newShapes;
};

/**
 * shape is closed and the vertex isn't first or last, so it's
 * the first vertex deleted from closed shape. Make vertices to
 * either side of vertex into new first and last
 */
const deleteVertexAndOpenShape = (state, { key, closed = false }) => {
  const { shapes } = state;
  const [, vertexKey, , shapeKey] = key.split(DEFAULT_DELIMITER);
  const shapeIndex = shapes.indexOfKey(shapeKey);
  const shape = shapes.key(shapeKey);
  const { vertices } = shape;
  const vertexIndex = vertices.indexOfKey(vertexKey);
  const keys = [];
  const values = [];

  for (let i = 1, l = vertices.length; i < l; i++) {
    // start at 1 since 0 will be the vertex we're deleting,
    // then use % to loop around the end
    const idx = (vertexIndex + i) % l;
    keys.push(vertices.keys[idx]);
    values.push(vertices.values[idx]);
  }

  const newVertices = new List(values, keys);
  const newShapes = shapes.splice(
    {
      start: shapeIndex,
      deleteCount: 1,
      newKeys: [shapes.keys[shapeIndex]],
    },
    { vertices: newVertices, closed }
  );

  return newShapes;
};

// a vertex that isn't first or last in a shape is deleted, creating
// 2 open shapes are created from remaining vertices
const deleteVertexAndSplitShape = (state, { key }) => {
  const { pressedKeyCodes, shapes, subtractModifierCode } = state;
  const [, vertexKey, , shapeKey] = key.split(DEFAULT_DELIMITER);
  // const shapeIndex = shapes.indexOfKey(shapeKey);
  const shape = shapes.key(shapeKey);
  const { vertices } = shape;
  const vertexIndex = vertices.indexOfKey(vertexKey);
  const subtractModifierCodePressed = !!keySelector(subtractModifierCode)({
    pressedKeyCodes,
  });
  const keys1 = [];
  const keys2 = [];
  const values1 = [];
  const values2 = [];

  for (let i = 0; i < vertexIndex; i++) {
    keys1.push(vertices.keys[i]);
    values1.push(vertices.values[i]);
  }

  for (let i = vertexIndex + 1, l = vertices.length; i < l; i++) {
    keys2.push(vertices.keys[i]);
    values2.push(vertices.values[i]);
  }

  const newVertices1 = new List(values1, keys1);
  const newVertices2 = new List(values2, keys2);
  const newShapes = shapes.splice(
    {
      start: shapes.indexOf(shape),
      deleteCount: 1,
    },
    { vertices: newVertices1, closed: subtractModifierCodePressed },
    { vertices: newVertices2, closed: subtractModifierCodePressed }
  );
  return newShapes;
};

/**
 * Removes a single vertex from a List of vertices that belong to a Shape in a List of Shapes.
 * @TODO change signature so it takes (state, data) where state.shapes and data.key exist
 * split key into shapeKey and vertexKey
 */
const removeVertexFromShapes = (state, { key }) => {
  const { pressedKeyCodes, shapes, subtractModifierCode } = state;
  const [, vertexKey, , shapeKey] = key.split(DEFAULT_DELIMITER);
  const shape = shapes.key(shapeKey);
  const vertex = shape.vertices.key(vertexKey);
  const { closed, vertices } = shape;
  const subtractModifierCodePressed = !!keySelector(subtractModifierCode)({
    pressedKeyCodes,
  });

  if (vertices.length <= 1) {
    return deleteShape(
      { shapes },
      { key: `VERTEX::${vertexKey}::SHAPE::${shapeKey}` }
    );
  }

  // the vertex being deleted is neither first nor last for its shape
  if (vertex !== shape.vertices.first && vertex !== shape.vertices.last) {
    if (closed) {
      // the shape is closed, delete the vertex and open the shape.
      return deleteVertexAndOpenShape(
        { shapes },
        {
          key: `VERTEX::${vertexKey}::SHAPE::${shapeKey}`,
          closed: subtractModifierCodePressed,
        }
      );
    }
    // the shape is open, delete the vertex and split it into two new shapes.
    return deleteVertexAndSplitShape(
      { shapes },
      {
        key: `VERTEX::${vertexKey}::SHAPE::${shapeKey}`,
        closed: subtractModifierCodePressed,
      }
    );
  }

  // this is the first vertex of a shape. delete it and open the shape.
  if (vertex === shape.vertices.first) {
    const shapeIndex = shapes.indexOf(shape);
    const newShapes = shapes.splice(
      {
        deleteCount: 1,
        newKeys: [shapes.keys[shapeIndex]],
        start: shapeIndex,
      },
      {
        vertices: vertices.splice({
          start: 0,
          deleteCount: 1,
        }),
        closed: subtractModifierCodePressed,
      }
    );

    return newShapes;
  }

  // this is the last (as in last sequential, not only) vertex of a shape. delete it and open the shape.
  if (vertex === shape.vertices.last) {
    const shapeIndex = shapes.indexOf(shape);
    const newShapes = shapes.splice(
      {
        deleteCount: 1,
        newKeys: [shapes.keys[shapeIndex]],
        start: shapeIndex,
      },
      {
        vertices: vertices.splice({
          start: vertices.indexOf(vertex),
          deleteCount: 1,
        }),
        closed: subtractModifierCodePressed,
      }
    );
    return newShapes;
  }

  // this should not be reached, but just in case.
  // @TODO maybe remove?
  return shapes;
};

export default removeVertexFromShapes;
