// src/js/components/Screen.js
import PropTypes from 'prop-types';
import React from 'react';
import { AppContext, Stage } from 'react-pixi-fiber';
import { Provider, connect, ReactReduxContext } from 'react-redux';

import { StageCanvas } from 'App/data/styles';

// needs context
const Screen = ({ context, children }) => (
    <ReactReduxContext.Consumer>{({ store }) => {
        const {
            backgroundColor,
            width,
            height,
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
                    }
                }
                style={StageCanvas}
                hitArea={new PIXI.Rectangle(0, 0, width, height)}
                width={width}
                height={height}
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
