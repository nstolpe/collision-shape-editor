// src/js/actions/action.js

import {
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

export const addVertex = ({ x, y }) => ({
  type: ADD_VERTEX,
  data: { x, y },
});

export const deleteVertex = id => ({
  type: DELETE_VERTEX,
  data: { id },
});

export const moveVertex = ({ id, x, y }) => ({
  type: MOVE_VERTEX,
  data: { x, y, id },
});

/**
 * @param {array} vertices
 */
export const moveVertices = vertices => ({
  type: MOVE_VERTICES,
  data: { vertices },
});

export const startMoveVertex = id => ({
  type: START_MOVE_VERTEX,
  data: { id },
});

export const stopMoveVertex = id => ({
  type: STOP_MOVE_VERTEX,
  data: { id },
});

export const setInteraction = interaction => ({
  type: SET_INTERACTION,
  data: { interaction },
});

export const setMode = mode => ({
  type: SET_MODE,
  data: { mode },
});

export const setTool = tool => ({
  type: SET_TOOL,
  data: { tool },
});

export const resize = ({ width, height }) => ({
  type: RESIZE,
  data: { width, height },
});

export const scaleUI = ({ x, y }) => ({
  type: SCALE_UI,
  data: { x, y },
});

export const setBackgroundColor = backgroundColor => ({
  type: SET_BACKGROUND_COLOR,
  data: { backgroundColor },
});

export const setAltPressed = pressed => ({
  type: SET_ALT_PRESSED,
  data: { pressed },
});

export const setCtrlPressed = pressed => ({
  type: SET_CTRL_PRESSED,
  data: { pressed },
});

export const addTextureSource = (id, data) => ({
  type: ADD_TEXTURE_SOURCE,
  data: { id, data },
});

export const removeTextureSource = source => ({
  type: REMOVE_TEXTURE_SOURCE,
  data: { source },
});

export const addSprite = sprite => ({
  type: ADD_SPRITE,
  data: { sprite },
});
