// src/js/components/pixi/InteractiveViewport.js
import React, { useEffect } from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import {
  addSprite,
  removeTextureSource,
  scaleUI,
  setAltPressed,
  setCtrlPressed,
  setShiftPressed,
} from 'actions/actions';
import {
  clearKeys,
  pressKey,
  releaseKey,
} from 'actions/modifier-keys-actions';
import Rectangle from 'components/pixi/base/Rectangle';
import Shapes from 'components/pixi/Shapes';
import Sprites from 'components/pixi/Sprites';
import Viewport from 'components/pixi/base/Viewport';
import { COPY, CROSSHAIR, GRAB, NO_DROP, POINTER } from 'constants/cursors';
import { ADD, DELETE, SELECT } from 'constants/tools';
import * as Modes from 'constants/modes';
import withSelectOverlay from 'components/pixi/hoc/withSelectOverlay';
import usePointerInteractions from 'hooks/usePointerInteractions';

/**
 * Adds global keyboard shortcuts to `document`.
 *
 * @param {function} dispatch  Dispatch function to call actions with.
 */
const useKeyboardShortcuts = dispatch => {
  useEffect(() => {
    const onKeyDown = ({ code, key, keyCode }) => dispatch(pressKey(code));
    const onKeyUp = ({ code, key, keyCode }) => dispatch(releaseKey(code));

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [dispatch]);
};

const getCursor = ({ mode, tool, altPressed, ctrlPressed, shiftPressed }) => {
  switch (true) {
    case tool !== SELECT:
      return POINTER;
    default:
      return CROSSHAIR;
  }
};

/**
 * `pixi-viewport` component.
 */
const InteractiveViewport = ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  scale,
  children,
  screenHeight,
  screenWidth,
  panModifierCode,
  overlayRef,
  viewportBackgroundProps,
  ...restProps
}) => {
  const pixiApp = usePixiApp();
  const {
    renderer: {
      plugins: { interaction },
    },
  } = pixiApp;
  // const [cursor, setCursor] = useState(GRAB);
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = usePointerInteractions();

  useKeyboardShortcuts(dispatch);

  useEffect(() => {
    const onBlur = () => {
      if (overlayRef.current) {
        overlayRef.current.drag({ keyToPress: [panModifierCode] });
      }
      dispatch(clearKeys());
    };

    const onFocus = () => {
      if (overlayRef.current) {
        overlayRef.current.drag({ keyToPress: [panModifierCode] });
      }
      dispatch(clearKeys());
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [dispatch, overlayRef, panModifierCode]);

  return (
    <Viewport
      name="VIEWPORT"
      ref={overlayRef}
      drag={{ keyToPress: [panModifierCode] }}
      pinch={{ percent: 1 }}
      wheel={{ percent: 0.05 }}
      interaction={interaction}
      // cursor={cursor}
      cursor={getCursor({ mode, tool })}
      screenHeight={screenHeight}
      screenWidth={screenWidth}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointermove={handlePointerMove}
      {...restProps}
    >
      <Rectangle
        {...viewportBackgroundProps}
        fill={backgroundColor}
        name="BACKGROUND"
      />
      <Sprites />
      <Shapes />
    </Viewport>
  );
};

export default InteractiveViewport;
