// src/js/reducers/reducer.js

import {v4 as uuid} from 'uuid';
import {
    ADD_VERTEX,
    MOVE_VERTEX,
    RESIZE,
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
};

const rootReducer = (state = initialState, action) => {
    const data = action.data;
    switch (action.type) {
        case ADD_VERTEX:
            return {
                ...state,
                vertices: [ ...state.vertices, { ...data, id: uuid() } ],
            };
        case MOVE_VERTEX:
            const vertex = state.vertices.find(vertex => vertex.id === data.id);
            console.log(data)
            return {
                ...state,
                vertices: state.vertices.map(
                    vertex => vertex.id === data.id && state.movingVertices.find(vertex => vertex.id === data.id) ? data : vertex
                ),
            };
        case RESIZE:
            return {
                ...state,
                ...action.data,
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
            return state;
    }
};

export default rootReducer;
