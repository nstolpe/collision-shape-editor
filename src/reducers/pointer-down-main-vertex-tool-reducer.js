import * as Tools from 'Constants/tools';
import removeVertexFromShapes from 'Reducers/helpers/remove-vertex-from-shapes';
import { translation } from 'Utility/math';
import { DEFAULT_DELIMITER } from 'Utility/prefix';
import projectShapesToVertices from 'Utility/projectors/project-shapes-to-vertices';
import List from 'Utility/List';

/**
 * Returns an updated copy of the keyed distances between each of the selected
 * vertices and the pointer coordinate.
 * @TODO move this to the state utility (which will be renamed vertex utility)
 */
export const getUpdatedSelectedVertexDistances = (
  { selectedVertices, shapes },
  data
) => {
  const { coordinates } = data;
  // @TODO drill down shapes.key(shapeKey).vertices.key(vertexKey) instead to avoid this processing
  const projectedVertices = projectShapesToVertices(shapes);
  const newSelectedVertices = Object.keys(selectedVertices).reduce(
    (keyedDistances, key) => {
      const { x, y } = projectedVertices.key(key);
      const newDistance = translation({ x, y }, coordinates);
      keyedDistances[key] = newDistance;
      return keyedDistances;
    },
    {}
  );

  return newSelectedVertices;
};

// @TODO structure this more like a reducer or rename. or both.
const vertexAddToolReducer = (state, { data }) => {
  const { selectedVertices, shapes } = state;
  const { key } = data;
  const [, vertexKey, , targetShapeKey] = key.split(DEFAULT_DELIMITER);
  const targetShape = shapes.key(targetShapeKey);
  const targetVertex = targetShape.vertices.key(vertexKey);
  const isTargetFirst = targetShape.vertices.first === targetVertex;
  const isTargetLast = targetShape.vertices.last === targetVertex;

  if (!targetShape.closed && Object.keys(selectedVertices).length === 1) {
    // The targetShape is open and only one other vertex is selected.
    // This could potentially close targetShape or join it with another shape.
    const [, selectedVertexKey, , selectedVertexShapeKey] =
      Object.keys(selectedVertices)?.[0].split(DEFAULT_DELIMITER) || [];
    const selectedVertexShape = shapes.key(selectedVertexShapeKey);

    if (selectedVertexKey === vertexKey) {
      // the only selected vertex was clicked again, leave early and do nothing.
      return {};
    }

    if (selectedVertexShapeKey === targetShapeKey) {
      // selected and clicked vertices are on the same shape.
      // @TODO make this it's own function. tryToCloseShape
      if (
        (isTargetLast &&
          selectedVertexKey &&
          selectedVertexKey === targetShape.vertices.keys[0]) ||
        (isTargetFirst &&
          selectedVertexKey &&
          selectedVertexKey ===
            targetShape.vertices.keys[targetShape.vertices.length - 1])
      ) {
        // targetVertex is the last vertex of targetShape and selectedVertex is first
        // or targetVertex is first and selectedVertex is last so close the shape
        const newShapes = shapes.map((shape, _, key) => {
          if (key === targetShapeKey) {
            return { ...shape, closed: true };
          }
          return shape;
        });

        return {
          selectedVertices: {},
          shapes: newShapes,
        };
      }
    } else if (!selectedVertexShape.closed) {
      // two vertices are on different shapes and 2nd shape is open
      // @TODO own function. tryToJoinShapes
      let vertices1;
      let vertices2;
      // const selectedVertexShape = shapes.key(selectedVertexShapeKey);
      const selectedVertex =
        selectedVertexShape.vertices.key(selectedVertexKey);
      const isSelectedFirst =
        selectedVertexShape.vertices.first === selectedVertex;
      const isSelectedLast =
        selectedVertexShape.vertices.last === selectedVertex;

      // first to first
      if (isSelectedFirst && isTargetFirst) {
        vertices1 = selectedVertexShape.vertices.reverse();
        vertices2 = targetShape.vertices;
      }

      // first to last
      if (isSelectedFirst && isTargetLast) {
        vertices1 = selectedVertexShape.vertices.reverse();
        vertices2 = targetShape.vertices.reverse();
      }

      // last to first
      if (isSelectedLast && isTargetFirst) {
        vertices1 = selectedVertexShape.vertices;
        vertices2 = targetShape.vertices;
      }

      // last to last
      if (isSelectedLast && isTargetLast) {
        vertices1 = selectedVertexShape.vertices;
        vertices2 = targetShape.vertices.reverse();
      }

      const newShape = {
        ...selectedVertexShape,
        vertices: new List(
          [...vertices1.values, ...vertices2.values],
          [...vertices1.keys, ...vertices2.keys]
        ),
      };
      const newShapes = shapes.reduce((newShapes, shape, idx, key) => {
        if (shape === targetShape) {
          return newShapes;
        }
        if (shape === selectedVertexShape) {
          return newShapes.append([key], newShape);
        }
        return newShapes.append([key], shape);
      }, List());

      return { shapes: newShapes, selectedVertices: {} };
    }
  }
  // @TODO duplicated-select-code with main Tools.SELECT case below
  const { coordinates, position } = data;
  const newSelectedVertices = getUpdatedSelectedVertexDistances(state, data);
  return {
    selectedVertices: newSelectedVertices,
    queuedSelectedVertex: {
      coordinates,
      key,
      position,
    },
    selectedVertexQueue: [
      {
        coordinates,
        key,
        position,
      },
    ],
  };
};

const reducer = (state, { data, type }) => {
  switch (type) {
    case Tools.ADD: {
      const newState = vertexAddToolReducer(state, { data });
      return {
        ...state,
        ...newState,
      };
    }
    case Tools.DELETE: {
      const newSelectedVertices = getUpdatedSelectedVertexDistances(
        state,
        data
      );
      const newShapes = removeVertexFromShapes(state, data);
      return {
        ...state,
        shapes: newShapes,
        selectedVertices: Object.entries(newSelectedVertices).reduce(
          (result, [key, value]) => {
            if (key !== data.key) {
              result[key] = value;
            }
            return result;
          },
          {}
        ),
      };
    }
    case Tools.SELECT: {
      // @TODO duplicated-select-code
      const { coordinates, key, position } = data;
      const newSelectedVertices = getUpdatedSelectedVertexDistances(
        state,
        data
      );
      return {
        ...state,
        selectedVertices: newSelectedVertices,
        queuedSelectedVertex: {
          coordinates,
          key,
          position,
        },
        selectedVertexQueue: [
          {
            coordinates,
            key,
            position,
          },
        ],
      };
    }
    default:
      return state;
  }
};

export default reducer;
