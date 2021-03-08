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
  ADD_TEXTURE_SOURCE,
  REMOVE_TEXTURE_SOURCE,
  ADD_SPRITE,
} from 'constants/action-types';
import Interactions from 'constants/interactions';
import Modes from 'constants/modes';
import Tools from 'constants/tools';

export const initialState = {
  backgroundColor: 0xc1ddca,
  interaction: Interactions.TRANSLATE,
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
  vertices: [
    {
      x: 400,
      y: 200,
      id: uuid(),
    },
    {
      x: 600,
      y: 200,
      id: uuid(),
    },
    {
      x: 700,
      y: 300,
      id: uuid(),
    },
    {
      x: 700,
      y: 500,
      id: uuid(),
    },
    {
      x: 600,
      y: 600,
      id: uuid(),
    },
    {
      x: 400,
      y: 600,
      id: uuid(),
    },
    {
      x: 300,
      y: 500,
      id: uuid(),
    },
    {
      x: 300,
      y: 300,
      id: uuid(),
    },
  ],
  movingVerticeIds: [],
  scale: { x: 1, y: 1 },
  ctrlPressed: false,
  altPressed: false,
  rootContainer: null,
};

const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_ROOT_CONTAINER:
      return {
        ...state,
        rootContainer: data.container,
      };
    case ADD_VERTEX:
      return {
        ...state,
        vertices: [...state.vertices, { x: data.x, y: data.y, id: uuid() }],
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
      return {
        ...state,
        vertices: state.vertices.map(
          stateVertex =>
            data.vertices.find(({ id }) => id === stateVertex.id) || stateVertex
        ),
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
      console.log(`undefined action: ${action.type}`, action);
      return state;
  }
};

export default reducer;
