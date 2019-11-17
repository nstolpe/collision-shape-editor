// src/js/store/Store.js
import React, { useState, useReducer } from 'react';
import {v4 as uuid} from 'uuid';

import {
    ADD_VERTEX,
    DELETE_VERTEX,
    MOVE_VERTEX,
    START_MOVE_VERTEX,
    STOP_MOVE_VERTEX,
    RESIZE,
    SCALE_UI,
    SET_BACKGROUND_COLOR,
    SET_ALT_PRESSED,
    SET_CTRL_PRESSED,
    ADD_TEXTURE_SOURCE,
    REMOVE_TEXTURE_SOURCE,
    ADD_SPRITE,
} from "constants/action-types";
import ScreenContext from 'contexts/ScreenContext';
import Modes from 'constants/modes';

const initialState = {
    backgroundColor: 0x44fc03,
    mode: Modes.VERTEX,
    tool: Tools.ADD,
    // width: 0,
    // height: 0,
    resolution: window.devicePixelRatio,
    lastResize: Date.now(),
    images: {
        default: 'turtle-body.png',
    },
    textureSources: [],
    sprites: [],
    vertices: [
        {
            x: 200,
            y: 400,
            id: uuid(),
        },
        {
            x: 223,
            y: 456,
            id: uuid(),
        },
        {
            x: 500,
            y: 800,
            id: uuid(),
        },
    ],
    movingVerticeIds: [],
    UIScale: { x: 1, y: 1 },
    ctrlPressed: false,
    altPressed: false,
    testContainerPosition: { x: 0, y: 0 },
};

const reducer = (state, action) => {
    const { data, type } = action;

    switch (type) {
        case ADD_VERTEX:
            const { x, y } = data;

            return {
                ...state,
                vertices: [...state.vertices, { data.x, data.y, id: uuid() }],
            };
        case DELETE_VERTEX:
            const { id } = data;

            return {
                ...state,
                vertices: state.vertices.filter(vertex => vertex.id !== id),
            };
        case MOVE_VERTEX:
            const { id, x, y } = data;

            return {
                ...state,
                vertices: state.vertices.map(vertex => vertex.id === data.id ? data : vertex),
            };
        case START_MOVE_VERTEX:
            const { id } = data;

            return {
                ...state,
                movingVerticeIds: [...state.movingVerticeIds, id],
            };
        case STOP_MOVE_VERTEX:
            const { id } = data;

            return {
                ...state,
                movingVerticeIds: state.movingVerticeIds.filter(vertexId => vertexId !== id),
            };
        case RESIZE:
            return {
                ...state,
                ...action.data,
            };
        case SCALE_UI:
            const { x, y } = data;

            return {
                ...state,
                UIScale: { x, y },
            };
        case SET_BACKGROUND_COLOR:
            const { backgroundColor } = data;
            return {
                ...state,
                backgroundColor,
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
        default:
            console.log(`undefined action: ${action.type}`, action);
            return state;
    }
};

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
};

export default Store;
