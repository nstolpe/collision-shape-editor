// src/js/actions/action.js

import {
    ADD_VERTEX,
    DELETE_VERTEX,
    MOVE_VERTEX,
    RESIZE,
    SCALE_UI,
    START_VERTEX_MOVE,
    STOP_VERTEX_MOVE,
} from "App/constants/action-types";

export const resize = ({ width, height }) => ({
    type: RESIZE,
    data: { width, height },
});

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

export const scaleUI = ({ x, y }) => ({
    type: SCALE_UI,
    data: { x, y },
});

export const startVertexMove = ({ x, y, id }) => ({
    type: START_VERTEX_MOVE,
    data: { x, y, id },
});

export const stopVertexMove = ({ x, y, id }) => ({
    type: STOP_VERTEX_MOVE,
    data: { x, y, id },
});
