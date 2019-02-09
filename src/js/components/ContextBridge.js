// src/js/components/ContextBridge.js
import React from 'react';

import { Provider, ReactReduxContext } from "react-redux";
import { AppContext } from 'react-pixi-fiber';

import { ContextOne, ContextTwo } from 'App/contexts/contexts';
import store from 'App/store/store';
// console.log(Provider);
// console.log(ReactReduxContext.Consumer);
// console.log(AppContext);

const ContextBridge = props => (
    <ReactReduxContext.Consumer>{
        data => (
            <AppContext.Consumer>{
                app => (
                    props.barrierRender(
                        <AppContext.Provider app={app}>
                            <Provider store={store}>
                                {props.children}
                            </Provider>
                        </AppContext.Provider>
                    )
                )
            }</AppContext.Consumer>
        )
    }</ReactReduxContext.Consumer>
);

export default ContextBridge;
