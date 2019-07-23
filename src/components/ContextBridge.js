// src/js/components/ContextBridge.js
import React from 'react';

import { Provider, ReactReduxContext } from "react-redux";
import { AppContext, Stage } from 'react-pixi-fiber';

import { ContextOne, ContextTwo } from 'App/contexts/contexts';
import store from 'App/store/store';

const addApp = (children, app) => React.Children.map(children, child => React.cloneElement(child, { app: app }));

const ContextBridge = props => (
    <ReactReduxContext.Consumer>{() => (
        <Stage>
            <AppContext.Consumer>{app => (
                props.barrierRender(
                    <AppContext.Provider>
                        <Provider store={store}>
                            {addApp(props.children, app)}
                        </Provider>
                    </AppContext.Provider>
                )
            )}</AppContext.Consumer>
        </Stage>
    )}</ReactReduxContext.Consumer>
);

export default ContextBridge;
