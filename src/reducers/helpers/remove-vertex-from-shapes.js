// src/reducers/helpers/remove-vertex-from-shapes.js
import List from 'tools/List';

/**
 * Removes a single vertex from a List of vertices that belong to a Shape in a List of Shapes.
 */
const removeVertexFromShapes = (shapes, shapeKey, vertexKey) => {
  const shape = shapes.key(shapeKey);
  const vertex = shape.vertices.key(vertexKey);
  const { closed, vertices } = shape;

  switch (true) {
    case vertices.length <= 1: {
      // last vertex, remove the shape.
      const newShapes = shapes.splice(
        {
          start: shapes.indexOf(shape),
          deleteCount: 1,
        }
      );

      return newShapes;
    }
    case (
      closed &&
      vertex !== shape.vertices.first &&
      vertex !== shape.vertices.last
    ): {
      // first vertex deleted from closed shape, make vertices to
      // either side of vertex into new first and last
      const vertexIndex = vertices.indexOf(vertex);
      const shapeIndex = shapes.indexOf(shape);
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
          newKeys: [shapes.keys[shapeIndex]]
        },
        { vertices: newVertices, closed: false },
      );

      return newShapes;
    }
    case (
      vertex !== shape.vertices.first &&
      vertex !== shape.vertices.last
    ): {
      // 2 open shapes are created from remaining vertices
      const vertexIndex = vertices.indexOf(vertex);
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
        { vertices: newVertices1, closed: false },
        { vertices: newVertices2, closed: false },
      );
      return newShapes;
    }
    case vertex === shape.vertices.first: {
      const newShapes = shapes.splice(
        {
          start: shapes.indexOf(shape),
          deleteCount: 1,
        },
        {
          vertices: vertices.splice(
            {
              start: 0,
              deleteCount: 1,
            }
          ),
          closed: false,
        }
      );

      return newShapes;
    }
    case vertex === shape.vertices.last: {
      const newShapes = shapes.splice(
        {
          start: shapes.indexOf(shape),
          deleteCount: 1,
        },
        {
          vertices: vertices.splice(
            {
              start: vertices.indexOf(vertex),
              deleteCount: 1,
            }
          ),
          closed: false,
        }
      );
      return newShapes;
    }
    default:
      return shapes;
  }
};

export default removeVertexFromShapes;
