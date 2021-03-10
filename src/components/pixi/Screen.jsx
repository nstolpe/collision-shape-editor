// src/js/components/pixi/Screen.js
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Stage } from 'react-pixi-fiber';

import { useRootContext } from 'contexts/RootContext';
import ScreenContext from 'contexts/ScreenContext';
import InteractiveViewport from 'components/pixi/InteractiveViewport';

const Screen = ({ children, width, height }) => {
  const state = useRootContext();

  useEffect(() => {
    const onKeyDown = ({ key, keyCode }) => {
      if (key === 'Control' || keyCode === 17) {
        console.log('control pressed');
      } else if (key === 'Alt' || keyCode === 18) {
        console.log('alt pressed');
      } else if (key === 'Shift' || keyCode === 16) {
        console.log('shift pressed');
      }
    };

    const onKeyUp = ({ key, keyCode }) => {
      if (key === 'Control' || keyCode === 17) {
        console.log('control released');
      } else if (key === 'Alt' || keyCode === 18) {
        console.log('alt released');
      } else if (key === 'Shift' || keyCode === 16) {
        console.log('shift released');
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <Stage
      onContextMenu={e => {
        console.log(e.type);
        e.preventDefault();
      }}
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
