// src/reducers/root-reducer.js
import { v4 as uuid } from 'uuid';

import {
  SET_ROOT_CONTAINER,
  ADD_VERTEX,
  DELETE_VERTEX,
  MOVE_VERTEX,
  MOVE_VERTICES,
  START_MOVE_VERTEX,
  STOP_MOVE_VERTEX,
  SET_INTERACTION,
  SET_MODE,
  SET_TOOL,
  RESIZE,
  SCALE_UI,
  SET_BACKGROUND_COLOR,
  SET_ALT_PRESSED,
  SET_CTRL_PRESSED,
  SET_SHIFT_PRESSED,
  SET_SELECT_OVERLAY,
  SET_SELECT_OVERLAY_ENABLED,
  SET_SELECT_OVERLAY_POSITION,
  SET_SELECT_OVERLAY_DIMENSIONS,
  ADD_TEXTURE_SOURCE,
  REMOVE_TEXTURE_SOURCE,
  ADD_SPRITE,
} from 'constants/action-types';
import * as Modes from 'constants/modes';
import * as Tools from 'constants/tools';
import List from 'tools/List';

const vertices = [
  [
    {
      x: 400,
      y: 200,
    },
    {
      x: 600,
      y: 200,
    },
    {
      x: 700,
      y: 300,
    },
    {
      x: 700,
      y: 500,
    },
    {
      x: 600,
      y: 600,
    },
    {
      x: 400,
      y: 600,
    },
    {
      x: 300,
      y: 500,
    },
    {
      x: 300,
      y: 300,
    },
  ],
  [
    {
      x: 800,
      y: 600,
    },
    {
      x: 1000,
      y: 600,
    },
    {
      x: 1000,
      y: 800,
    },
    {
      x: 800,
      y: 800,
    },
  ],
];

export const initialState = {
  backgroundColor: 0x19f750,
  // interaction: Interactions.TRANSLATE,
  mode: Modes.VERTEX,
  tool: Tools.SELECT,
  // width: 0,
  // height: 0,
  resolution: window.devicePixelRatio,
  lastResize: Date.now(),
  images: {
    default: 'turtle-body.png',
  },
  textureSources: [],
  sprites: [],
  vertices: List(vertices[0]),
  shapes: List([
    {
      vertices: List(vertices[0]),
      closed: true,
    },
    {
      vertices: List(vertices[1]),
      closed: false,
    }
  ]),
  movingVerticeIds: [],
  scale: { x: 1, y: 1 },
  altPressed: false,
  ctrlPressed: false,
  shiftPressed: false,
  rootContainer: null,
  selectOverlay: {
    enabled: false,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  },
  uiOptions: {
    vertexRadius: 6.5,
  },
};

/**
 * @TODO this needs to move whever the action is called to MOVE_VERTICES
 * that point will need access to shapes from state. currently this should be
 * in usePointerInteractions
 */
const moveVertices = (shapes, vertices) => {
  const newShapes = new List(shapes, shapes.keys);

  for (const v of vertices) {
    // @TODO use DEFAULT_DELIMITER
    const [, vertexKey, , shapeKey] = v.name.split('::');
    const shape = newShapes.key(shapeKey);
    const vertex = shape.vertices.key(vertexKey);
    const vertexIndex = shape.vertices.keys.indexOf(vertexKey);
    const newVertices = shape.vertices.map(
      (vertex, index, key) => {
        if (key === vertexKey) {
          return { x: v.x, y: v.y };
        } else {
          return vertex;
        }
      }
    );
    newShapes.setByKey({
      ...shape,
      vertices: newVertices,
    }, shapeKey);
  }

  return newShapes;
};

export const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_ROOT_CONTAINER:
      return {
        ...state,
        rootContainer: data.container,
      };
    case SET_SELECT_OVERLAY:
      return {
        ...state,
        selectOverlay: { ...state.selectOverlay, ...data },
      };
    case SET_SELECT_OVERLAY_ENABLED:
      return {
        ...state,
        selectOverlay: { ...state.selectOverlay, enabled: data }
      };
    case SET_SELECT_OVERLAY_POSITION:
      return {
        ...state,
        selectOverlay: {
          ...state.selectOverlay,
          x: data.x,
          y: data.y,
        },
      };
    case SET_SELECT_OVERLAY_DIMENSIONS:
      return {
        ...state,
        selectOverlay: {
          ...state.selectOverlay,
          height: data.height,
          width: data.width,
        },
      };
    case ADD_VERTEX:
      console.log(ADD_VERTEX)
      return {
        ...state,
        vertices: List([...state.vertices, { x: data.x, y: data.y, id: uuid() }]),
      };
    case DELETE_VERTEX:
      return {
        ...state,
        vertices: state.vertices.filter(vertex => vertex.id !== data.id),
      };
    case MOVE_VERTEX:
      return {
        ...state,
        vertices: state.vertices.map(vertex => vertex.id === data.id ? data : vertex),
      };
    case START_MOVE_VERTEX:
      return {
        ...state,
        movingVerticeIds: [...state.movingVerticeIds, data.id],
      };
    case STOP_MOVE_VERTEX:
      return {
        ...state,
        movingVerticeIds: state.movingVerticeIds.filter(vid => vid !== data.id),
      };
    case MOVE_VERTICES:
      // @TODO: this should be MOVE_SHAPE_VERTICES or something. moveVertices logic
      // should occur before the action is called and should just send { shapes } as data
      return {
        ...state,
        shapes: moveVertices(state.shapes, data.vertices),
      };
    case SET_INTERACTION:
      return {
        ...state,
        mode: data.interaction,
      };
    case SET_MODE:
      return {
        ...state,
        mode: data.mode,
      };
    case SET_TOOL:
      return {
        ...state,
        tool: data.tool,
      };
    case RESIZE:
      return {
        ...state,
        ...action.data,
      };
    case SCALE_UI:
      return {
        ...state,
        scale: { x: data.x, y: data.y },
      };
    case SET_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColor: data.backgroundColor,
      };
    case SET_ALT_PRESSED:
      return {
        ...state,
        altPressed: data.pressed,
      };
    case SET_CTRL_PRESSED:
      return {
        ...state,
        ctrlPressed: data.pressed,
      };
    case SET_SHIFT_PRESSED:
      return {
        ...state,
        shiftPressed: data.pressed,
      };
    case ADD_TEXTURE_SOURCE:
      return {
        ...state,
        textureSources: [ ...state.textureSources, { ...data } ],
      };
    case REMOVE_TEXTURE_SOURCE:
      return {
        ...state,
        textureSources: state.textureSources.filter(textureSource => textureSource.id !== data.source.id),
      };
    case ADD_SPRITE:
      return {
        ...state,
        sprites: [ ...state.sprites, { ...data.sprite } ],
      };
    default:
      // console.log(`undefined action: ${action.type}`, action);
      return state;
  }
};
