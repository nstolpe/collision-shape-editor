// src/js/actions/action.js

import {
    ADD_VERTEX,
    DELETE_VERTEX,
    MOVE_VERTEX,
    START_VERTEX_MOVE,
    STOP_VERTEX_MOVE,
    RESIZE,
    SCALE_UI,
    SET_BACKGROUND_COLOR,
    SET_ALT_PRESSED,
    SET_CTRL_PRESSED,
    SET_TEST_CONTAINER_POSITION,
} from "App/constants/action-types";

export const addVertex = ({ x, y }) => ({
    type: ADD_VERTEX,
    data: { x, y },
});

export const deleteVertex = id => ({
    type: DELETE_VERTEX,
    data: { id },
});

export const moveVertex = ({ x, y, id }) => ({
    type: MOVE_VERTEX,
    data: { x, y, id },
});

export const startVertexMove = ({ x, y, id }) => ({
    type: START_VERTEX_MOVE,
    data: { x, y, id },
});

export const stopVertexMove = ({ x, y, id }) => ({
    type: STOP_VERTEX_MOVE,
    data: { x, y, id },
});

export const resize = ({ width, height }) => ({
    type: RESIZE,
    data: { width, height },
});

export const scaleUI = ({ x, y }) => ({
    type: SCALE_UI,
    data: { x, y },
});

export const setBackgroundColor = color => ({
    type: SET_BACKGROUND_COLOR,
    data: { color },
});

export const setAltPressed = pressed => ({
    type: SET_ALT_PRESSED,
    data: { pressed },
});

export const setCtrlPressed = pressed => ({
    type: SET_CTRL_PRESSED,
    data: { pressed },
});

export const setTestContainerPosition = ({ x, y }) => ({
    type: SET_TEST_CONTAINER_POSITION,
    data: { x, y },
});

window.setTestContainerPosition = setTestContainerPosition;
