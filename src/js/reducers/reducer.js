// src/js/reducers/reducer.js

import {v4 as uuid} from 'uuid';
import {
    ADD_VERTEX,
    DELETE_VERTEX,
    MOVE_VERTEX,
    RESIZE,
    SCALE_UI,
    SET_BACKGROUND_COLOR,
    SET_ALT_PRESSED,
    SET_CTRL_PRESSED,
    START_VERTEX_MOVE,
    STOP_VERTEX_MOVE,
    ADD_TEXTURE_SOURCE,
    REMOVE_TEXTURE_SOURCE,
    ADD_SPRITE,
    SET_TEST_CONTAINER_POSITION,
} from "App/constants/action-types";

const initialState = {
    backgroundColor: 0x44fc03,
    width: 0,
    height: 0,
    resolution: window.devicePixelRatio,
    lastResize: Date.now(),
    images: {
        default: 'turtle-body.png',
    },
    textureSources: [],
    sprites: [],
    vertices: [],
    movingVertices: [],
    UIScale: { x: 1, y: 1 },
    ctrlPressed: false,
    altPressed: false,
    testContainerPosition: { x: 0, y: 0 },
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
        case SET_BACKGROUND_COLOR:
            return {
                ...state,
                backgroundColor: data.color,
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
        case SET_TEST_CONTAINER_POSITION:
            return {
                ...state,
                testContainerPosition: { ...data },
            };
        default:
            console.log(`undefined action: ${action.type}`, action);
            return state;
    }
};

export default rootReducer;
