// src/js/reducers/reducer.js

import {v4 as uuid} from 'uuid';
import {
    ADD_VERTEX,
    DELETE_VERTEX,
    MOVE_VERTEX,
    RESIZE,
    SCALE_UI,
    START_VERTEX_MOVE,
    STOP_VERTEX_MOVE,
} from "App/constants/action-types";

const initialState = {
    width: 0,
    height: 0,
    resolution: window.devicePixelRation,
    lastResize: undefined,
    images: {
        default: 'turtle-body.png',
    },
    vertices: [],
    movingVertices: [],
    UIScale: { x: 1, y: 1 },
};

const rootReducer = (state = initialState, action) => {
    const data = action.data;
    switch (action.type) {
        case ADD_VERTEX:
            return {
                ...state,
                vertices: [ ...state.vertices, { ...data, id: uuid() } ],
            };
        case DELETE_VERTEX:
            return {
                ...state,
                vertices: state.vertices.filter(vertex => vertex.id !== data.id),
            };
        case MOVE_VERTEX:
            const vertex = state.vertices.find(vertex => vertex.id === data.id);
            return {
                ...state,
                vertices: state.vertices.map(vertex => vertex.id === data.id ? data : vertex),
            };
        case RESIZE:
            return {
                ...state,
                ...action.data,
            };
        case SCALE_UI:
            return {
                ...state,
                UIScale: { ...data },
            };
        case START_VERTEX_MOVE:
            return {
                ...state,
                movingVertices: [ ...state.movingVertices, { ...data } ],
            };
        case STOP_VERTEX_MOVE:
            return {
                ...state,
                movingVertices: state.movingVertices.filter(vertex => vertex.id !== data.id),
            };
        default:
            console.log(`undefined action: ${action.type}`, action);
            return state;
    }
};

export default rootReducer;
