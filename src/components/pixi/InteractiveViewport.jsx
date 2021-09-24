// src/js/components/pixi/InteractiveViewport.js
import * as PIXI from 'pixi.js';
import React, { useEffect, useState } from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import {
  addSprite,
  removeTextureSource,
  scaleUI,
  setAltPressed,
  setCtrlPressed,
  setShiftPressed,
} from 'actions/actions';
import scaleComparator from 'comparators/scale';
import withSelector from 'components/hoc/withSelector';
import Geometry from 'components/pixi/Geometry';
import Rectangle from 'components/pixi/base/Rectangle';
import Sprites from 'components/pixi/Sprites';
import Viewport from 'components/pixi/base/Viewport';
import { GRAB, POINTER } from 'constants/cursors';
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
    const onKeyDown = ({ key, keyCode }) => {
      switch (true) {
        case key === 'Control' || keyCode === 17:
          console.log('control pressed');
          dispatch(setCtrlPressed(true));
          break;
        case key === 'Alt' || keyCode === 18:
          console.log('alt pressed');
          dispatch(setAltPressed(true));
          break;
        case key === 'Shift' || keyCode === 16:
          console.log('shift pressed');
          dispatch(setShiftPressed(true));
          break;
        default:
          /* @TODO log key and keyCode if debugging? (once that's set up)*/
      }
    };

    const onKeyUp = ({ key, keyCode }) => {
      if (key === 'Control' || keyCode === 17) {
        dispatch(setCtrlPressed(false));
        console.log('control released');
      } else if (key === 'Alt' || keyCode === 18) {
        dispatch(setAltPressed(false));
        console.log('alt released');
      } else if (key === 'Shift' || keyCode === 16) {
        dispatch(setShiftPressed(false));
        console.log('shift released');
      }
    };

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
    default:
      return POINTER;
  }
};

const selector = ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  scale,
  vertices,
}) => ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  scale,
  vertices,
});

const comparator = (
  {
    scale,
    vertices,
    ...restProps
  },
  {
    scale: oldScale,
    vertices: oldVertices,
    ...restOldProps
  }
) => {
  // @TODO maybe scale can be required to conform to { x. y }, and drop array ans scalar.
  const scaleX = scale?.x ?? scale?.[0] ?? scale;
  const scaleY = scale?.y ?? scale?.[1] ?? scale;
  const oldScaleX = oldScale?.x ?? oldScale?.[0] ?? oldScale;
  const oldScaleY = oldScale?.y ?? oldScale?.[1] ?? oldScale;

  if (!scaleComparator({ scale: { x: scaleX, y: scaleY } }, { scale: { x: oldScaleX, y: oldScaleY } })) {
    return false;
  }

  if (vertices?.length !== oldVertices?.length) {
    return false;
  }

  for (let i = 0, l = vertices?.length; i < l; i++) {
    const vertex = vertices.index(i);
    const oldVertex = oldVertices.index(i);

    if (
      vertex.name !== oldVertex.name ||
      vertex.x !== oldVertex.x ||
      vertex.y !== oldVertex.y
    ) {
      return false;
    }
  }

  for (let key of Object.keys(restProps)) {
    if (restProps[key] !== restOldProps[key]) {
      return false;
    }
  }

  return true;
};

/**
 * `pixi-viewport` component.
 */
const InteractiveViewport = props => {
  const {
    dispatch,
    backgroundColor,
    mode,
    tool,
    textureSources,
    scale,
    children,
    screenHeight,
    screenWidth,
    vertices,
    ...restProps
  } = props;
  const pixiApp = usePixiApp();
  const { loader, renderer } = pixiApp;
  const { plugins: { interaction } } = renderer;
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

  const viewportRef = useOverlayRef();

  useEffect(
    () => {
      textureSources.forEach(textureSource => {
        if (!loader.resources[textureSource.id]) {
          loader.add(textureSource.id, textureSource.data);
          removeTextureSource(textureSource);
        } else {
          // notify that load didn't happen
        }
      });
      loader.load((loader, resources) => {
        textureSources.forEach(textureSource => {
          addSprite({
            name: textureSource.id,
            texture: resources[textureSource.id].texture,
            x: screenWidth * 0.5,
            y: screenHeight * 0.5,
            rotation: 0,
            scale: [1, 1],
            scaleMode: PIXI.SCALE_MODES.NEAREST,
          });
        });
      });
    },
    [
      textureSources,
      loader,
      screenHeight,
      screenWidth
    ]
  );

  const {
    onFrameEnd,
    onMoved,
    onMovedEnd,
    viewportBackgroundProps,
  } = useViewportHandlers(viewportRef, screenHeight, screenWidth);

  useKeyboardShortcuts(dispatch);

  return (
    <Viewport
      name="VIEWPORT"
      ref={viewportRef}
      drag={{ keyToPress: 'ControlLeft' }}
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
        name={'BACKGROUND'}
      />
      <Sprites />
      <Geometry
        interactive={mode === Modes.VERTEX}
        interactiveChildren={mode === Modes.VERTEX}
        scale={scale}
        selectedVertices={selectedVertices}
        setCursor={setCursor}
        vertices={vertices}
      />
    </Viewport>
  );
};

export default withSelector(ScreenContext, selector, comparator)(InteractiveViewport);
