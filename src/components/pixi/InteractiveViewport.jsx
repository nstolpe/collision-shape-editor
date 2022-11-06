// src/js/components/pixi/InteractiveViewport.js
import React, { useEffect } from 'react';
import { Container, usePixiApp } from 'react-pixi-fiber/index.js';

import {
  addSprite,
  removeTextureSource,
  scaleUI,
  setAltPressed,
  setCtrlPressed,
  setShiftPressed,
} from 'Actions/actions';
import { clearKeys, pressKey, releaseKey } from 'Actions/modifier-keys-actions';
import Rectangle from 'Components/pixi/base/Rectangle';
import Circle from 'Components/pixi/base/Circle';
import Shapes from 'Components/pixi/Shapes';
import Sprites from 'Components/pixi/Sprites';
import Viewport from 'Components/pixi/base/Viewport';
import { COPY, CROSSHAIR, GRAB, NO_DROP, POINTER } from 'Constants/cursors';
import { ADD, DELETE, SELECT } from 'Constants/tools';
import * as Modes from 'Constants/modes';
import withSelectOverlay from 'Components/pixi/hoc/withSelectOverlay';
import usePointerInteractions from 'Hooks/usePointerInteractions';

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
  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    usePointerInteractions();

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
