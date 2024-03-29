// src/js/constants/action-types.js

/**
 * Key Presses
 */
export const CLEAR_PRESSED_KEYS = 'CLEAR_PRESSED_KEYS';
export const PRESS_KEY = 'PRESS_KEY';
export const RELEASE_KEY = 'RELEASE_KEY';
export const SET_ADD_KEY_PRESSED = 'SET_ADD_KEY_PRESSED';
export const SET_SUBTRACT_KEY_PRESSED = 'SET_SUBTRACT_KEY_PRESSED';
export const SET_PAN_KEY_PRESSED = 'SET_PAN_KEY_PRESSED';
export const SET_ALT_PRESSED = 'SET_ALT_PRESSED';
export const SET_CTRL_PRESSED = 'SET_CTRL_PRESSED';
export const SET_SHIFT_PRESSED = 'SET_SHIFT_PRESSED';

/**
 * Vertices
 */
export const ADD_VERTEX = 'ADD_VERTEX';
export const INSERT_VERTEX_BEFORE = 'INSERT_VERTEX_BEFORE';
export const INSERT_VERTEX_AFTER = 'INSERT_VERTEX_AFTER';
export const DELETE_VERTEX = 'DELETE_VERTEX';
export const DELETE_EDGE = 'DELETE_EDGE';
export const MOVE_VERTEX = 'MOVE_VERTEX';
export const START_MOVE_VERTEX = 'START_MOVE_VERTEX';
export const STOP_MOVE_VERTEX = 'STOP_MOVE_VERTEX';
export const MOVE_VERTICES = 'MOVE_VERTICES';
export const SET_SELECTED_VERTEX_POSITIONS_RELATIVE_TO_COORDINATES =
  'SET_SELECTED_VERTEX_POSITIONS_RELATIVE_TO_COORDINATES';
export const SET_SELECTED_VERTICES = 'SET_SELECTED_VERTICES';
export const ADD_SELECTED_VERTICES = 'ADD_SELECTED_VERTICES';
export const RECENTER_SELECTED_VERTICES = 'RECENTER_SELECTED_VERTICES';

/**
 * Shapes
 */
export const CLOSE_SHAPE = 'CLOSE_SHAPE';
export const OPEN_SHAPE = 'OPEN_SHAPE';
export const TOGGLE_SHAPE_SHOW_WINDING = 'TOGGLE_SHAPE_WINDING';
export const REVERSE_SHAPE_WINDING = 'REVERSE_SHAPE_WINDING';
export const CREATE_SHAPE = 'CREATE_SHAPE';
export const DELETE_SHAPE = 'DELETE_SHAPE';

/**
 * DOM
 */
export const SET_ROOT_CONTAINER = 'SET_ROOT_CONTAINER';

/**
 * PIXI
 */
export const SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR';
export const SET_SELECT_OVERLAY = 'SET_SELECT_OVERLAY';
export const SET_SELECT_OVERLAY_ENABLED = 'SET_SELECT_OVERLAY_ENABLED';
export const SET_SELECT_OVERLAY_POSITION = 'SET_SELECT_OVERLAY_POSITION';
export const SET_SELECT_OVERLAY_DIMENSIONS = 'SET_SELECT_OVERLAY_DIMENSIONS';
export const SET_PIXI_APP = 'SET_PIXI_APP';
export const SET_POINTER_COORDINATES = 'SET_POINTER_COORDINATES';

/**
 * PIXI Contex Menu
 */
export const SET_CONTEXT_MENU = 'SET_CONTEX_MENU';
export const SET_CONTEXT_MENU_OPEN = 'SET_CONTEX_MENU_OPEN';
export const SET_CONTEXT_MENU_POSITION = 'SET_CONTEXT_MENU_POSITION';
export const CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU';

export const SET_INTERACTION = 'SET_INTERACTION';
export const SET_MODE = 'SET_MODE';
export const SET_TOOL = 'SET_TOOL';

export const RESIZE = 'RESIZE';
export const SCALE_UI = 'SCALE_UI';

export const ADD_TEXTURE_SOURCE = 'ADD_TEXTURE_SOURCE';
export const REMOVE_TEXTURE_SOURCE = 'REMOVE_TEXTURE_SOURCE';

export const ADD_SPRITE = 'ADD_SPRITE';
