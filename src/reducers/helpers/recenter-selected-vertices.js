import { expandAABB } from 'Utility/math';
import { DEFAULT_DELIMITER } from 'Utility/prefix';

const recenterSelectedVertices = (newCenter, selectedVertices, shapes) => {
  const shapeKeys = [];
  const vertexKeys = [];
  let bounds = [Infinity, -Infinity, Infinity, -Infinity];

  for (const key of Object.keys(selectedVertices)) {
    const [, vertexKey,, shapeKey] = key.split(DEFAULT_DELIMITER);
    const vertex = shapes.key(shapeKey).vertices.key(vertexKey);

    bounds = expandAABB(vertex.x, vertex.y, bounds[0], bounds[1], bounds[2], bounds[3]);

    if (!shapeKeys.includes(shapeKey)) {
      shapeKeys.push(shapeKey);
    }
    vertexKeys.push(vertexKey);
  }

  const [minX, maxX, minY, maxY] = bounds;
  const currentCenter = {
    x: minX + ((maxX - minX) * 0.5),
    y: minY + ((maxY - minY) * 0.5),
  };

  const newShapes = shapes.map((shape, idx, shapeKey) => {
    if (shapeKeys.includes(shapeKey)) {
      return {
        ...shape,
        vertices: shape.vertices.map((vertex, idx, vertexKey) => {
          if (vertexKeys.includes(vertexKey)) {
            const vertex = shapes.key(shapeKey).vertices.key(vertexKey);
            const distanceFromCenter = {
              x: vertex.x - currentCenter.x,
              y: vertex.y - currentCenter.y,
            };

            return {
              x: newCenter.x + distanceFromCenter.x,
              y: newCenter.y + distanceFromCenter.y,
            }
          }
          return vertex;
        })
      };
    }

    return shape;
  });

  return newShapes;
};

export default recenterSelectedVertices;
