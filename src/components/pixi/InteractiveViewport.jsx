// src/js/components/pixi/InteractiveViewport.js
import * as PIXI from 'pixi.js';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import {
  addSprite,
  removeTextureSource,
  scaleUI,
  setAltPressed,
  setCtrlPressed,
  setShiftPressed,
} from 'actions/actions';
import withSelector from 'components/hoc/withSelector';
import Geometry from 'components/pixi/Geometry';
import Rectangle from 'components/pixi/base/Rectangle';
import Sprites from 'components/pixi/Sprites';
import Viewport from 'components/pixi/base/Viewport';
import { GRAB, GRABBING, POINTER } from 'constants/cursors';
import * as Modes from 'constants/modes';
import ScreenContext from 'contexts/ScreenContext';
import useOverlayRef from 'hooks/useOverlayRef';
import usePointerInteractions from 'hooks/usePointerInteractions';

/**
 * Compares all arguments for strict equality
 */
const allEqual = (...elements) => elements.reduce(
  (areEqual, element, index) => areEqual && element === elements[(index + 1) % elements.length],
  true
);

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
  selectOverlay: {
    enabled: selectOverlayEnabled,
    height: selectOverlayHeight,
    width: selectOverlayWidth,
    x: selectOverlayX,
    y: selectOverlayY,
  },
}) => ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  scale,
  vertices,
  selectOverlayEnabled,
  selectOverlayHeight,
  selectOverlayWidth,
  selectOverlayX,
  selectOverlayY,
});

const comparator = (
  {
    scale,
    vertices,
    selectOverlay,
    selectOverlayEnabled,
    selectOverlayHeight,
    selectOverlayWidth,
    selectOverlayX,
    selectOverlayY,
    ...restProps
  },
  {
    scale: oldScale,
    vertices: oldVertices,
    selectOverlay: oldSelectOverlay,
    selectOverlayEnabled: oldSelectOverlayEnabled,
    selectOverlayHeight: oldSelectOverlayHeight,
    selectOverlayWidth: oldSelectOverlayWidth,
    selectOverlayX: oldSelectOverlayX,
    selectOverlayY: oldSelectOverlayY,
    ...restOldProps
  }
) => {
  if (
    (scale?.x ?? scale?.[0] ?? scale) !== (oldScale?.x ?? oldScale?.[0] ?? oldScale) ||
    (scale?.y ?? scale?.[1] ?? scale) !== (oldScale?.y ?? oldScale?.[1] ?? oldScale)
  ) {
    return false;
  }

  // @TODO move the selector overlay into it's own component, if possible.
  if (
    oldSelectOverlayEnabled !== selectOverlayEnabled ||
    oldSelectOverlayHeight !== selectOverlayHeight ||
    oldSelectOverlayWidth !== selectOverlayWidth ||
    oldSelectOverlayX !== selectOverlayX ||
    oldSelectOverlayY !== selectOverlayY
  ) {
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
    // @TODO move overlay to own component
    selectOverlayEnabled,
    selectOverlayHeight,
    selectOverlayWidth,
    selectOverlayX,
    selectOverlayY,
    ...restProps
  } = props;
  const pixiApp = usePixiApp();
  const { loader, renderer, ticker } = pixiApp;
  window.ticker = window.ticker ?? pixiApp.ticker;
  const { plugins: { interaction } } = renderer;
  const [cursor, setCursor] = useState(GRAB);
  const onPointerDown = event => {
    setCursor(GRABBING)
  };
  // const onPointerDown = () => setCursor(GRABBING);
  const onPointerUp = () => setCursor(GRAB);
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    selectedVertices,
  } = usePointerInteractions(dispatch, tool, vertices, scale);
  const onZoomed = ({
    viewport: {
      scale: { x, y },
    },
  }) => dispatch(scaleUI({ x, y }));

  const viewportRef = useOverlayRef();
  const [viewportBackgroundProps, setViewportBackgroundProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [backgroundPropsSet, setBackgroundPropsSet] = useState(false);

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

  useKeyboardShortcuts(dispatch);

  return (
    <Viewport
      name="VIEWPORT"
      ref={viewportRef}
      drag={{ keyToPress: 'ControlLeft' }}
      pinch={{ percent: 1 }}
      wheel={{ percent: 0.05 }}
      onzoomed={onZoomed}
      interaction={interaction}
      // cursor={cursor}
      cursor={getCursor({ mode, tool })}
      pointerdown={onPointerDown}
      pointerup={onPointerUp}
      screenHeight={screenHeight}
      screenWidth={screenWidth}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointermove={handlePointerMove}
      onmovedend={viewport => {
        const { top, bottom, left, right } = viewport;

        setViewportBackgroundProps(
          currentViewportBackgroundProps => ({
              ...currentViewportBackgroundProps,
              ...{
                x: left,
                y: top,
                width: right - left,
                height: bottom - top,
              },
          })
        );
      }}
      onmoved={({ viewport }) => {
        const { top, bottom, left, right } = viewport;

        setViewportBackgroundProps(
          currentViewportBackgroundProps => ({
              ...currentViewportBackgroundProps,
              ...{
                x: left,
                y: top,
                width: right - left,
                height: bottom - top,
              },
          })
        );
      }}
      onframeend={viewport => {
        const { top, bottom, left, right } = viewport;

        if (!backgroundPropsSet && !allEqual(top, bottom, 0) && !allEqual(left, right, 0)) {
          setViewportBackgroundProps(
            currentViewportBackgroundProps => ({
                ...currentViewportBackgroundProps,
                ...{
                  x: left,
                  y: top,
                  width: right - left,
                  height: bottom - top,
                },
            })
          );

          setBackgroundPropsSet(true);
        }
      }}
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
