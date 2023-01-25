import { SHAPE, VERTEX } from 'Constants/prefixes';
import { DEFAULT_DELIMITER } from 'Utility/prefix';

export const flattenedVertexKey = (vertexId, shapeId) =>
  `${VERTEX}${DEFAULT_DELIMITER}${vertexId}${DEFAULT_DELIMITER}${SHAPE}${DEFAULT_DELIMITER}${shapeId}`;
