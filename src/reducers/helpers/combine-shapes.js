// src/reducers/helpers/combine-shapes.js
import List from 'Utility/List';

export const JoinTypes = {
  FIRST_FIRST: 'FIRST_FIRST',
  FIRST_LAST: 'FIRST_LAST',
  LAST_FIRST: 'LAST_FIRST',
  LAST_LAST: 'LAST_LAST',
};

const combineShapes = ({
  shapes,
  shape1,
  shapeKey1,
  shape2,
  shapeKey2,
  joinType,
}) => {
  let vertices1;
  let vertices2;
  switch (joinType) {
    case JoinTypes.FIRST_FIRST:
      vertices1 = shape1.vertices.reverse();
      vertices2 = shape2.vertices;
      break;
    case JoinTypes.FIRST_LAST:
      vertices1 = shape1.vertices.reverse();
      vertices2 = shape2.vertices.reverse();
      break;
    case JoinTypes.LAST_FIRST:
      vertices1 = shape1.vertices;
      vertices2 = shape2.vertices;
      break;
    case JoinTypes.LAST_LAST:
      vertices1 = shape1.vertices;
      vertices2 = shape2.vertices.reverse();
      break;
    default:
      return shapes;
  }

  const newShape = {
    ...shape1,
    vertices: new List(
      [...vertices1.values, ...vertices2.values],
      [...vertices1.keys, ...vertices2.keys]
    ),
  };

  return shapes.reduce((newShapes, shape, idx, key) => {
      switch (true) {
        case shape === shape2:
          return newShapes;
        case shape === shape1:
          return newShapes.append([key], newShape);
        default:
          return newShapes.append([key], shape);
      }
    }, List());
};

combineShapes.JoinTypes = JoinTypes;

export default combineShapes;
