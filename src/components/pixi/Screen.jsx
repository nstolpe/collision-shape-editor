// src/js/components/pixi/Screen.js
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { Stage } from 'react-pixi-fiber';

import { useRootContext } from 'contexts/RootContext';
import ScreenContext from 'contexts/ScreenContext';
import {
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
        console.log(e.type);
        e.preventDefault();
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
