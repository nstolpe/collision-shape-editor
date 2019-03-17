// src/js/components/Screen.js
import * as PIXI from "pixi.js";
import PropTypes from 'prop-types';
import React from 'react';
import { AppContext, Stage } from 'react-pixi-fiber';
import {
    connect,
    Provider,
    ReactReduxContext,
} from 'react-redux';

import { StageCanvas } from 'App/data/styles';

// needs context
const Screen = ({ context, children, width, height }) => (
    <ReactReduxContext.Consumer>{({ store }) => {
        const {
            backgroundColor,
            resolution
        } = store.getState();

        return (
            <Stage
                width={width}
                height={height}
                options={
                    {
                        backgroundColor: backgroundColor,
                        autoResize: true,
                        resolution: resolution,
                        antialias: true,
                    }
                }
                style={StageCanvas}
                hitArea={new PIXI.Rectangle(0, 0, width, height)}
                interactive
            >
                <AppContext.Consumer>{app => (
                    <Provider store={store} context={context}>
                        {React.Children.map(children, child => React.cloneElement(child, { app }))}
                    </Provider>
                )}</AppContext.Consumer>
            </Stage>
        );
    }}</ReactReduxContext.Consumer>
);

Screen.propTypes = {
    context: PropTypes.object.isRequired,
};

// export default connect(state => state)(Screen);
export default Screen;
