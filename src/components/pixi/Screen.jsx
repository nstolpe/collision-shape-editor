// src/js/components/pixi/Screen.js
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { Stage, AppContext } from 'react-pixi-fiber';

import { useRootContext } from 'contexts/RootContext';
import ScreenContext from 'contexts/ScreenContext';
import {
  setPixiApp,
  setAltPressed,
  setCtrlPressed,
  setShiftPressed,
} from 'actions/actions';
import InteractiveViewport from 'components/pixi/InteractiveViewport';
import Rectangle from 'components/pixi/base/Rectangle';

const Screen = ({ children, width, height }) => {
  const state = useRootContext();

  return (
    <Stage
      onContextMenu={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      name="SCREEN"
      options={
        {
          width,
          height,
          // backgroundColor: state.backgroundColor,
          autoResize: true,
          resolution: state.resolution,
          antialias: true,
        }
      }
    >
      <ScreenContext.Provider value={state}>
        <AppContext.Consumer>{pixiApp => {
          if (state.pixiApp !== pixiApp) {
            state.dispatch(setPixiApp(pixiApp));
          }

          return (
            <InteractiveViewport
              screenWidth={width}
              screenHeight={height}
              worldWidth={width}
              worldHeight={height}
            />
          );
        }}</AppContext.Consumer>
      </ScreenContext.Provider>
    </Stage>
    );
};

Screen.propTypes = {
  children: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
};

Screen.defaultProps = {
  children: [],
  width: 0,
  height: 0,
};

export default Screen;
