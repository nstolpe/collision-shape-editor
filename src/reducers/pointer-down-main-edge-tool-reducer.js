import { SHAPE, VERTEX } from 'Constants/prefixes';
import * as Tools from 'Constants/tools';
import removeEdgeFromShapes from 'Reducers/helpers/remove-edge-from-shapes';
import { keySelector } from 'Selectors/keys';
import { DEFAULT_DELIMITER } from 'Utility/prefix';
import { getUpdatedSelectedVertexDistances } from 'Reducers/pointer-down-main-vertex-tool-reducer';
import { closestPointOnSegment } from 'Utility/math';
import { flattenedVertexKey } from 'Utility/key';

const insertNewAfterVertex = ({ shape, vertexKey, x, y }) => {
  const vertexIndex = shape.vertices.indexOfKey(vertexKey) + 1;
  const newVertices = shape.vertices.splice(
    {
      start: vertexIndex,
      deleteCount: 0,
      // @TODO remove this once you know it's not needed
      // newKeys: [undefined],
    },
    { x, y }
  );

  return { ...shape, vertices: newVertices };
};

/**
 * Returns state-like object where the shapes key stores a cloned List
 * of shapes with the shape stored at shapeKey replaced by newShape.
 */
const replaceShape = ({ newShape, shapeKey, shapes }) => {
  const shape = shapes.key(shapeKey);
  const shapeIndex = shapes.indexOf(shape);

  const newShapes = shapes.splice(
    {
      start: shapeIndex,
      deleteCount: 1,
      newKeys: [shapes.keys[shapeIndex]],
    },
    newShape
  );

  return { shapes: newShapes };
};

/**
 * Adds a new vertex at coordinates to the edge between the vertices at
 * vertexKey1 and vertexKey2. The position of the new vertex will be as
 * the closest point to coordinates that also lies on the line segment
 * between the two vertices.
 */
const addVertexToEdge = ({
  shapes,
  shapeKey,
  vertexKey1,
  vertexKey2,
  coordinates,
}) => {
  const shape = shapes.key(shapeKey);
  const vertex1 = shape.vertices.key(vertexKey1);
  const vertex2 = shape.vertices.key(vertexKey2);
  const [x, y] = closestPointOnSegment(vertex1, vertex2, coordinates);
  const newShape = insertNewAfterVertex({
    shape,
    vertexKey: vertexKey1,
    x,
    y,
  });
  const newShapes = replaceShape({ newShape, shapeKey, shapes }).shapes;

  return { shapes: newShapes };
};

const reducer = (state, { data, type }) => {
  switch (type) {
    case Tools.ADD: {
      // @TODO this case is long, break it out to at least one function.
      const { addModifierCode, pressedKeyCodes, shapes } = state;
      const { coordinates, target } = data;
      const [, vertexKey1, vertexKey2, , shapeKey] =
        target.name.split(DEFAULT_DELIMITER);
      const addModifierCodeKeyPressed = !!keySelector(addModifierCode)({
        pressedKeyCodes,
      });
      const modifiedState = {
        ...state,
        ...addVertexToEdge({
          shapes,
          coordinates,
          shapeKey,
          vertexKey1,
          vertexKey2,
        }),
        selectedVertices: getUpdatedSelectedVertexDistances(state, data),
      };

      const vertices = modifiedState.shapes.key(shapeKey).vertices;
      const vertexIndex = vertices.keys.indexOf(vertexKey1);
      const newVertex = vertices.index(vertexIndex + 1);
      const newVertexKey = vertices.keyOf(newVertex);
      let selectedVertices = {
        [flattenedVertexKey(newVertexKey, shapeKey)]: { x: 0, y: 0 },
      };

      // if add modifier (@TODO make primary modifier) is pressed, add
      // to selectedVertices instead of replacing them.
      if (addModifierCodeKeyPressed) {
        selectedVertices = {
          ...selectedVertices,
          ...modifiedState.selectedVertices,
        };
      }
      return { ...modifiedState, selectedVertices };
    }
    case Tools.DELETE:
      return { ...state, ...removeEdgeFromShapes(state, data) };
    case Tools.SELECT: {
      const { shapes } = state;
      const { coordinates, target } = data;
      const [, vertexId1, vertexId2, , shapeId] =
        target.name.split(DEFAULT_DELIMITER);
      const newSelectedVertices = getUpdatedSelectedVertexDistances(
        state,
        data
      );
      const selectedVertexQueue = [vertexId1, vertexId2].map((vertexId) => {
        // @TODO: make helper functions for putting together these keys.
        const vertexKey = flattenedVertexKey(vertexId, shapeId);
        const shape = shapes.key(shapeId);
        const vertex = shape.vertices.key(vertexId);

        return { coordinates, key: vertexKey, position: { ...vertex } };
      });

      return {
        ...state,
        selectedVertices: newSelectedVertices,
        selectedVertexQueue,
      };
    }
    default:
      return state;
  }
};

export default reducer;
