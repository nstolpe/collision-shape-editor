// src/js/reducers/reducer.js

import {
    RESIZE,
    ADD_VERTEX,
} from "App/constants/action-types";

const initialState = {
    width: 0,
    height: 0,
    resolution: window.devicePixelRation,
    lastResize: undefined,
    images: {
        default: 'turtle-body.png',
    },
    vertices: [
        // { x: 100, y: 100 },
        // { x: 200, y: 100 },
        // { x: 200, y: 200 },
        // { x: 100, y: 200 },
    ],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESIZE:
            return {
                ...state,
                ...action.data,
            };
        case ADD_VERTEX:
            return {
                ...state,
                vertices: [ ...state.vertices, action.data ],
            };
        default:
            return state;
    }
};

export default rootReducer;
