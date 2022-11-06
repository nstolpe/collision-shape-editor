// src/reducers/helpers/remove-edge-from-shapes.js

import List from 'Utility/List';

/**
 * Removes an edge (two sequential vertices, or the first and last vertices)
 * from a List of vertices that belong to a Shape in a List of Shapes.
 */

const removeEdgeFromShapes = (shapes, shapeKey, vertexKey1, vertexKey2) => {
  const shape = shapes.key(shapeKey);
  const shapeIndex = shapes.indexOf(shape);
  const vertex1 = shape.vertices.key(vertexKey1);
  const vertex2 = shape.vertices.key(vertexKey2);
  const { closed, vertices } = shape;

  switch (true) {
    case (
      closed &&
      vertex1 === shape.vertices.last &&
      vertex2 === shape.vertices.first
    ): {
      // if the shape is closed and the vertices are first and last,
      // open the shape so vertex2 becomes first and vertex1 becomes last.
      const newShapes = shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]]
        },
        { ...shape, vertices, closed: false },
      );

      return newShapes;
    }
    case closed: {
      // if the shape is closed and the vertices aren't first and last,
      // open it and reorder the vertices
      const vertex1Index = shape.vertices.indexOf(vertex1);
      const vertex2Index = shape.vertices.indexOf(vertex2);
      const keys = [];
      const values = [];

      for (let i = 0, l = vertices.length; i < l; i++) {
        // vertex2 will be in the new first vertex.
        const idx = (vertex2Index + i) % l;
        keys.push(vertices.keys[idx]);
        values.push(vertices.values[idx]);
      }

      const newVertices = new List(values, keys);
      const newShapes = shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]]
        },
        { ...shape, vertices: newVertices, closed: false },
      );

      return newShapes;
    }
    case (
      !closed &&
      vertex1 === shape.vertices.first &&
      vertex2 === shape.vertices.index(1)
    ): {
      // if the shape is open and the vertices are 0 and 1,
      // return a new list where 0 is popped
      const newVertices = vertices.splice({ start: 0, deleteCount: 1 });
      const newVertices1 = vertices.splice({ start: 0, deleteCount: 1 });
      const newVertices2 = vertices.shift();

      return shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]]
        },
        { ...shape, vertices: newVertices1 },
        { ...shape, vertices: newVertices2 },
      );
    }
    case (
      !closed &&
      vertex1 === shape.vertices.index(shape.vertices.length - 2) &&
      vertex2 === shape.vertices.last
    ): {
      // if the shape is open and the vertices are vertices.last and vertices.last - 1,
      // return a new list where vertices last is popped
      const newVertices = vertices.splice({ start: shape.vertices.length - 1, deleteCount: 1 });
      const newVertices1 = vertices.splice({ start: shape.vertices.length - 1, deleteCount: 1 });
      const newVertices2 = vertices.pop();

      return shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]]
        },
        { ...shape, vertices: newVertices1 },
        { ...shape, vertices: newVertices2 },
      );
    }
    case(
      !closed && (
        vertex1 !== shape.vertices.index(shape.vertices.length - 2) &&
        vertex2 !== shape.vertices.last
      ) && (
        vertex1 !== shape.vertices.first &&
        vertex2 !== shape.vertices.index(1)
      )
    ): {
      // if the shape is open and the vertices are not the first or last two,
      // create two new open shapes
      const newVertices1 = vertices.slice(0, vertices.indexOf(vertex1) + 1);
      const newVertices2 = vertices.slice(vertices.indexOf(vertex1) + 1);

      return shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]],
        },
        { ...shape, vertices: newVertices1 },
        { ...shape, vertices: newVertices2 },
      )
    }
    default:
      return shapes;
  }


  return shapes;
};

export default removeEdgeFromShapes;
