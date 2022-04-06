// src/tools/state.js
import List from 'tools/List';
import { DEFAULT_DELIMITER } from 'tools/prefix';

// Tools for updating state. Used by reducers, so maybe should be tools/reducer

/**
 * recreates a List of shapes, updating the coordinates of shapes vertices based
 * on their distance from coordinates
 */
const getShapeVerticesRelativeToCoordinates = (selectedVertices, coordinates, shapes) => {
  let newShapes = new List(shapes, shapes.keys);

  for (const name in selectedVertices) {
    const [, vertexKey, , shapeKey] = name.split(DEFAULT_DELIMITER);
    const shape = newShapes.key(shapeKey);
    const vertex = shape.vertices.key(vertexKey);
    const vertexIndex = shape.vertices.keys.indexOf(vertexKey);
    const distance = selectedVertices[name];
    const newVertices = shape.vertices.map(
      (vertex, index, key) => {
        if (key === vertexKey) {
          return {
            x: coordinates.x + distance.x,
            y: coordinates.y + distance.y,
          };
        } else {
          return vertex;
        }
      }
    );

    newShapes = newShapes.setByKey({
      ...shape,
      vertices: newVertices,
    }, shapeKey);
  }

  return newShapes;
};

export default getShapeVerticesRelativeToCoordinates;
