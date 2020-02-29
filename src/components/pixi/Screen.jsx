// src/js/components/pixi/Screen.js
import * as PIXI from "pixi.js";
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Stage } from 'react-pixi-fiber';

import InteractiveViewport from 'components/pixi/InteractiveViewport';
import { useRootContext } from 'contexts/RootContext';
import ScreenContext from 'contexts/ScreenContext';
import Drawing from 'components/base/Drawing';

const Screen = ({ children, width, height }) => {
  const state = useRootContext();

  useEffect(() => {
    document.addEventListener('keydown', ({ key, keyCode }) => {
      if (key === 'Control' || keyCode === 17) {
        console.log('control pressed');
      } else if (key === 'Alt' || keyCode === 18) {
        console.log('alt pressed');
      } else if (key === 'Shift' || keyCode === 16) {
        console.log('shift pressed');
      }
    });

    document.addEventListener('keyup', ({ key, keyCode }) => {
      if (key === 'Control' || keyCode === 17) {
        console.log('control released');
      } else if (key === 'Alt' || keyCode === 18) {
        console.log('alt released');
      } else if (key === 'Shift' || keyCode === 16) {
        console.log('shift released');
      }
    });
  });
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
