import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
} from 'Constants/pointer-events';
import * as Tools from 'Constants/tools';
import { keySelector } from 'Selectors/keys';
import List from 'Utility/List';
import { DEFAULT_DELIMITER } from 'Utility/prefix';

// @TODO split this into 3 functions for the sections. give it and them better names.
const extendShapeOrAddShape = (state, { coordinates }) => {
  const { x, y } = coordinates;
  const { selectedVertices, shapes } = state;
  const selectedVertexKeys = Object.keys(selectedVertices);

  if (selectedVertexKeys.length === 1) {
    // one selected vertex...
    const [selectedVertexKey] = selectedVertexKeys;
    const [, vertexKey, , shapeKey] =
      selectedVertexKey.split(DEFAULT_DELIMITER);
    const shape = shapes.key(shapeKey);
    const shapeIndex = shapes.indexOf(shape);
    const vertices = shape.vertices;
    const vertexIndex = vertices.indexOfKey(vertexKey) + 1;

    if (!shape.closed && vertexKey === vertices.keys[0]) {
      // ...the shape is open and the selected vertex is the shape's first
      // so prepend a new vertex to the shape at the incoming coordinates
      const vertices = shape.vertices.splice(
        {
          start: vertexIndex - 1, // think this can be 0
          deleteCount: 0,
          newKeys: [undefined],
        },
        { x, y }
      );
      const newShapes = shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]],
        },
        { ...shape, vertices }
      );
      const key = `VERTEX::${
        vertices.keys[vertexIndex - 1]
      }::SHAPE::${shapeKey}`;
      return { shapes: newShapes, selectedVertices: { [key]: { x: 0, y: 0 } } };
    } else if (
      !shape.closed &&
      vertexKey === vertices.keys[vertices.length - 1]
    ) {
      // ...the shape is open and the selected vertex is the shape's last
      // so append a new vertex to the shape at the incoming coordinates
      const vertices = shape.vertices.splice(
        {
          start: vertexIndex,
          deleteCount: 0,
          newKeys: [undefined],
        },
        { x, y }
      );
      const newShapes = shapes.splice(
        {
          start: shapeIndex,
          deleteCount: 1,
          newKeys: [shapes.keys[shapeIndex]],
        },
        { ...shape, vertices }
      );
      const key = `VERTEX::${vertices.keys[vertexIndex]}::SHAPE::${shapeKey}`;
      return { shapes: newShapes, selectedVertices: { [key]: { x: 0, y: 0 } } };
    }
  }

  // no vertex is selected, so make a completely new shape and vertex.
  // that vertex will be selected.
  const newVertex = { x, y };
  const newVertices = List([newVertex]);
  const newShape = { vertices: newVertices, closed: false, showWinding: false };
  const {
    shapes: { keys, values },
  } = state;
  const newShapes = List([...values, newShape], keys);
  const vertexKey = newVertices.keyOf(newVertex);
  const shapeKey = newShapes.keyOf(newShape);
  const key = `VERTEX::${vertexKey}::SHAPE::${shapeKey}`;
  const newSelectedVertices = { [key]: { x: 0, y: 0 } };
  console.log('foobar');
  return {
    shapes: newShapes,
    selectedVertices: newSelectedVertices,
  };
};

const updateSelectOverlay = (state, { coordinates: { x, y } }) => {
  const { selectOverlay } = state;

  if (selectOverlay.x !== null && selectOverlay.y !== null) {
    return {
      selectOverlay: {
        ...selectOverlay,
        width: x - selectOverlay.x,
        height: y - selectOverlay.y,
      },
    };
  } else {
    return { selectOverlay };
  }
};

const pointerDownMainViewportToolReducer = (state, { data, type }) => {
  switch (type) {
    case Tools.ADD:
      // @TODO see extendShapeOrAddShape in usePointerInteractions.
      return { ...state, ...extendShapeOrAddShape(state, data) };
    case Tools.DELETE: {
      return state;
    }
    case Tools.SELECT: {
      const {
        coordinates: { x, y },
      } = data;
      return {
        ...state,
        selectOverlay: {
          enabled: true,
          x,
          y,
          height: 0,
          width: 0,
        },
      };
    }
    default:
      return state;
  }
};

const reducer = (state, { data, type }) => {
  switch (type) {
    case POINTER_DOWN: {
      const { panModifierCode, pressedKeyCodes, tool } = state;
      const panModifierKeyPressed = !!keySelector(panModifierCode)({
        pressedKeyCodes,
      });

      if (!panModifierKeyPressed) {
        return pointerDownMainViewportToolReducer(state, {
          data,
          type: tool,
        });
      }
      return state;
    }
    case POINTER_MOVE: {
      console.log('hola');
      return {
        ...state,
        ...updateSelectOverlay(state, data),
      };
    }
    case POINTER_UP: {
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
