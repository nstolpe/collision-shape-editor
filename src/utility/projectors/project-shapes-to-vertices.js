import { addPrefix, DEFAULT_DELIMITER } from 'Utility/prefix';
import List from 'Utility/List';
import { SHAPE, VERTEX } from 'Constants/prefixes';

// @TODO the vertex keys need to have some reference to shape keys
const projectShapesToVertices = (shapes) =>
  List(
    ...shapes.reduce(
      ([shapeVertexValues, shapeKeys], shape, _, shapeKey) => {
        const [newValues, newKeys] = shape.vertices.reduce(
          ([vertexValues, vertexKeys], vertex, _, vertexKey) => {
            const key = `${addPrefix(
              VERTEX,
              vertexKey
            )}${DEFAULT_DELIMITER}${addPrefix(SHAPE, shapeKey)}`;
            vertexValues.push(vertex);
            vertexKeys.push(key);
            // vertexKeys.push(vertexKey);
            return [vertexValues, vertexKeys];
          },
          [[], []]
        );
        shapeVertexValues.push(...newValues);
        shapeKeys.push(...newKeys);
        return [shapeVertexValues, shapeKeys];
      },
      [[], []]
    )
  );

export default projectShapesToVertices;
