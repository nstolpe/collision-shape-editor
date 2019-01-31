// src/js/actions/action.js

import {
    RESIZE,
    ADD_VERTEX,
} from "App/constants/action-types";

export const resize = ({ width, height }) => ({
    type: RESIZE,
    data: { width, height },
});

export const addVertex = ({ x, y }) => ({
    type: ADD_VERTEX,
    data: { x, y },
});
