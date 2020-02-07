// src/reducers/root-reducer.js
import {v4 as uuid} from 'uuid';

import {
  ADD_VERTEX,
  DELETE_VERTEX,
  MOVE_VERTEX,
  START_MOVE_VERTEX,
  STOP_MOVE_VERTEX,
  RESIZE,
  SCALE_UI,
  SET_BACKGROUND_COLOR,
  SET_ALT_PRESSED,
  SET_CTRL_PRESSED,
  ADD_TEXTURE_SOURCE,
  REMOVE_TEXTURE_SOURCE,
  ADD_SPRITE,
} from 'constants/action-types';
import Modes from 'constants/modes';
import Tools from 'constants/tools';

export const initialState = {
  backgroundColor: 0x44fc03,
  mode: Modes.VERTEX,
  tool: Tools.ADD,
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
      x: 200,
      y: 400,
      id: uuid(),
    },
    {
      x: 223,
      y: 456,
      id: uuid(),
    },
    {
      x: 500,
      y: 800,
      id: uuid(),
    },
  ],
  movingVerticeIds: [],
  scale: { x: 1, y: 1 },
  ctrlPressed: false,
  altPressed: false,
  testContainerPosition: { x: 0, y: 0 },
};

const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
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
