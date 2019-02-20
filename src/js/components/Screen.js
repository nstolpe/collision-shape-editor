// src/js/components/Screen.js
import PropTypes from 'prop-types';
import React, { createContext } from 'react';
import { AppContext, Stage } from 'react-pixi-fiber';
import { Provider, connect, ReactReduxContext } from "react-redux";

// needs context
const Screen = props => (
    <ReactReduxContext.Consumer>{({ store }) =>
        <Stage>
            <AppContext.Consumer>{app => (
                <Provider store={store} context={props.context}>{props.children}</Provider>
            )}</AppContext.Consumer>
        </Stage>
    }</ReactReduxContext.Consumer>
);

Screen.propTypes = {
    context: PropTypes.object.isRequired,
};

export default Screen;
