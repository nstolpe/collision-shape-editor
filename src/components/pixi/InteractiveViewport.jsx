// src/js/components/pixi/InteractiveViewport.js
import * as PIXI from 'pixi.js';
import React, { useCallback, useEffect, useState } from 'react';
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
import restComparator from 'comparators/rest';
import scaleComparator from 'comparators/scale';
import withSelector from 'components/hoc/withSelector';
import Rectangle from 'components/pixi/base/Rectangle';
import Shapes from 'components/pixi/Shapes';
import Sprites from 'components/pixi/Sprites';
import Viewport from 'components/pixi/base/Viewport';
import { COPY, CROSSHAIR, GRAB, NO_DROP, POINTER } from 'constants/cursors';
import { ADD, DELETE, SELECT } from 'constants/tools';
import * as Modes from 'constants/modes';
import ScreenContext from 'contexts/ScreenContext';
import useOverlayRef from 'hooks/useOverlayRef';
import usePointerInteractions from 'hooks/usePointerInteractions';
import useViewportHandlers from 'hooks/useViewportHandlers';

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

const selector = ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  panModifierCode,
}) => ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  panModifierCode,
});

/**
 * `pixi-viewport` component.
 */
const InteractiveViewport = ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  scale,
  children,
  screenHeight,
  screenWidth,
  panModifierCode,
  ...restProps
}) => {
  const pixiApp = usePixiApp();
  const {
    loader,
    renderer: {
      plugins: { interaction },
    },
  } = pixiApp;
  const [cursor, setCursor] = useState(GRAB);
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    selectedVertices,
  } = usePointerInteractions();
  const onZoomed = ({
    viewport: {
      scale: { x, y },
    },
  }) => dispatch(scaleUI({ x, y }));
  const [viewport, setViewport] = useState({});
  const viewportCallbackRef = node => {
    // if (viewport && viewport !== node) {
      console.log('setting viewport');
      setViewport(node);
    // }
  };

  useEffect(() => {
    console.log(viewport.center);
  }, [viewport.center]);
  const viewportRef = useOverlayRef();
  // useEffect(
  //   () => {
  //     textureSources.forEach(textureSource => {
  //       if (!loader.resources[textureSource.id]) {
  //         loader.add(textureSource.id, textureSource.data);
  //         removeTextureSource(textureSource);
  //       } else {
  //         // notify that load didn't happen
  //       }
  //     });
  //     loader.load((loader, resources) => {
  //       textureSources.forEach(textureSource => {
  //         addSprite({
  //           name: textureSource.id,
  //           texture: resources[textureSource.id].texture,
  //           x: screenWidth * 0.5,
  //           y: screenHeight * 0.5,
  //           rotation: 0,
  //           scale: [1, 1],
  //           scaleMode: PIXI.SCALE_MODES.NEAREST,
  //         });
  //       });
  //     });
  //   },
  //   [
  //     textureSources,
  //     loader,
  //     screenHeight,
  //     screenWidth
  //   ]
  // );

  const {
    onFrameEnd,
    onMoved,
    onMovedEnd,
    viewportBackgroundProps,
  } = useViewportHandlers(viewportRef, screenHeight, screenWidth);

  useKeyboardShortcuts(dispatch);

  useEffect(() => {
    const onBlur = () => {
      if (viewportRef.current) {
        viewportRef.current.drag({ keyToPress: [panModifierCode] });
      }
      dispatch(clearKeys());
    };

    const onFocus = () => {
      if (viewportRef.current) {
        viewportRef.current.drag({ keyToPress: [panModifierCode] });
      }
      dispatch(clearKeys());
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [dispatch, viewportRef, panModifierCode]);

  return (
    <Viewport
      name="VIEWPORT"
      ref={node => {
        viewportCallbackRef(node);
        if (viewportRef.current !== node) {
          viewportRef.current = node;
        }
      }}
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
      onframeend={onFrameEnd}
      onmoved={onMoved}
      onmovedend={onMovedEnd}
      onzoomed={onZoomed}
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

export default withSelector(ScreenContext, selector)(InteractiveViewport);
