// src/js/actions/action.js
import List from 'tools/List';

import {
  SET_ROOT_CONTAINER,
  ADD_VERTEX,
  INSERT_VERTEX_BEFORE,
  INSERT_VERTEX_AFTER,
  DELETE_VERTEX,
  DELETE_EDGE,
  MOVE_VERTEX,
  MOVE_VERTICES,
  SET_VERTEX_POSITIONS_RELATIVE_TO_COORDINATES,
  SET_SELECTED_VERTICES,
  ADD_SELECTED_VERTICES,
  RECENTER_SELECTED_VERTICES,
  OPEN_SHAPE,
  CLOSE_SHAPE,
  REVERSE_SHAPE_WINDING,
  TOGGLE_SHAPE_SHOW_WINDING,
  JOIN_SHAPES,
  CREATE_SHAPE,
  DELETE_SHAPE,
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
  SET_PIXI_APP,
  SET_POINTER_COORDINATES,
  SET_CONTEXT_MENU,
  SET_CONTEXT_MENU_OPEN,
  SET_CONTEXT_MENU_POSITION,
  CLOSE_CONTEXT_MENU,
  ADD_TEXTURE_SOURCE,
  REMOVE_TEXTURE_SOURCE,
  ADD_SPRITE,
} from 'constants/action-types';

export const setRootContainer = container => ({
  type: SET_ROOT_CONTAINER,
  data: { container },
});

export const setSelectOverlayEnabled = enabled => {
  return {
    type: SET_SELECT_OVERLAY_ENABLED,
    data: enabled,
  }
};

export const setSelectOverlayPosition = ({ x, y }) => {
  return {
    type: SET_SELECT_OVERLAY_POSITION,
    data: { x, y },
  }
};

export const setSelectOverlayDimensions = ({ width, height }) => {
  return {
    type: SET_SELECT_OVERLAY_DIMENSIONS,
    data: { width, height },
  }
};

export const setPixiApp = pixiApp => ({
  type: SET_PIXI_APP,
  data: { pixiApp },
});

export const setPointerCoordinates = (x, y) => ({
  type: SET_POINTER_COORDINATES,
  data: { x, y },
});

/**
 * data: {
 *   enabled: {boolean}
 *   x: {number}
 *   y: {number}
 *   width: {number}
 *   height: {number}
 * }
 */
export const setSelectOverlay = data => {
  return {
    type: SET_SELECT_OVERLAY,
    data,
  }
};

export const addVertex = ({ x, y }) => ({
  type: ADD_VERTEX,
  data: { x, y },
});

export const insertVertexBefore = ({ shapeKey, vertexKey, x, y, makeSelected=false }) => ({
  type: INSERT_VERTEX_BEFORE,
  data: { shapeKey, vertexKey, x, y, makeSelected },
});

export const insertVertexAfter = ({ shapeKey, vertexKey, x, y, makeSelected=false }) => ({
  type: INSERT_VERTEX_AFTER,
  data: { shapeKey, vertexKey, x, y, makeSelected },
});

export const deleteVertex = ({ shapeKey, vertexKey }) => ({
  type: DELETE_VERTEX,
  data: { shapeKey, vertexKey },
});

export const deleteEdge = ({ shapeKey, vertexKey1, vertexKey2 }) => ({
  type: DELETE_EDGE,
  data: { shapeKey, vertexKey1, vertexKey2 },
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

export const setVertexPositionsRelativeToCoordinates = (vertices, coordinates) => ({
  type: SET_VERTEX_POSITIONS_RELATIVE_TO_COORDINATES,
  data: { vertices, coordinates },
});

export const setSelectedVertices = selectedVertices => ({
  type: SET_SELECTED_VERTICES,
  data: { selectedVertices },
});

export const addSelectedVertices = selectedVertices => ({
  type: ADD_SELECTED_VERTICES,
  data: { selectedVertices },
});

export const recenterSelectedVertices = (x, y) => ({
  type: RECENTER_SELECTED_VERTICES,
  data: { x, y },
});

export const openShape = id => ({
  type: OPEN_SHAPE,
  data: { id },
});

export const closeShape = id => ({
  type: CLOSE_SHAPE,
  data: { id },
});

export const reverseShapeWinding = id => ({
  type: REVERSE_SHAPE_WINDING,
  data: { id },
});

export const toggleShapeShowWinding = id => ({
  type: TOGGLE_SHAPE_SHOW_WINDING,
  data: { id },
});

export const joinShapes = ({
  shape1,
  shapeKey1,
  shape2,
  shapeKey2,
  joinType,
}) => ({
  type: JOIN_SHAPES,
  data: {
    shape1,
    shapeKey1,
    shape2,
    shapeKey2,
    joinType,
  },
});

export const createShape = ({
  vertices=List(),
  closed=false,
  showWinding=false,
}) => ({
  type: CREATE_SHAPE,
  data: { vertices, closed, showWinding },
});

export const deleteShape = id => ({
  type: DELETE_SHAPE,
  data: { id },
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

export const setShiftPressed = pressed => ({
  type: SET_SHIFT_PRESSED,
  data: { pressed },
});

export const setContextMenu = (type, x, y, options) => ({
  type: SET_CONTEXT_MENU,
  data: { type, x, y, options },
});

export const setContextMenuOpen = open => ({
  type: SET_CONTEXT_MENU_OPEN,
  data: { open },
});

export const setContextMenuPosition = (x ,y) => ({
  type: SET_CONTEXT_MENU_POSITION,
  data: { x, y },
});

export const closeContextMenu = () => ({
  type: CLOSE_CONTEXT_MENU,
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
