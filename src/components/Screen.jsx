// src/js/components/Screen.js
import * as PIXI from "pixi.js";
import PropTypes from 'prop-types';
import React from 'react';
import { Stage } from 'react-pixi-fiber';

import InteractiveViewport from 'components/InteractiveViewport';
import { useRootContext } from 'contexts/RootContext';
import ScreenContext from 'contexts/ScreenContext';
import Sprites from 'components/Sprites';
import Vertices from 'components/Vertices';

const Screen = ({ children, width, height }) => {
    const state = useRootContext();

    return (
        <Stage
            options={
                {
                    width,
                    height,
                    backgroundColor: state.backgroundColor,
                    autoResize: true,
                    resolution: state.resolution,
                    antialias: true,
                }
            }
            hitArea={new PIXI.Rectangle(0, 0, width, height)}
            interactive
        >
            <ScreenContext.Provider value={state}>
                <InteractiveViewport
                    screenWidth={width}
                    screenHeight={height}
                    worldWidth={width}
                    worldHeight={height}
                >
                    <Sprites />
                    <Vertices />
                </InteractiveViewport>
            </ScreenContext.Provider>
        </Stage>
    );
};

Screen.propTypes = {
    children: PropTypes.array,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

Screen.defaultProps = {
    children: [],
};

export default Screen;
