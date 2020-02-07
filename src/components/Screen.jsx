// src/js/components/Screen.js
import * as PIXI from "pixi.js";
import PropTypes from 'prop-types';
import React from 'react';
import { Stage } from 'react-pixi-fiber';

import InteractiveViewport from 'components/InteractiveViewport';
import { useRootContext } from 'contexts/RootContext';
import ScreenContext from 'contexts/ScreenContext';
import Drawing from 'components/base/Drawing';

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
    >
      <ScreenContext.Provider value={state}>
        <InteractiveViewport
          screenWidth={width}
          screenHeight={height}
          worldWidth={width}
          worldHeight={height}
        />
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
