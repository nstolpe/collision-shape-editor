// src/js/components/pixi/InteractiveViewport.js
import * as PIXI from 'pixi.js';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import {
  addSprite,
  removeTextureSource,
  scaleUI,
} from 'actions/actions';
import * as Modes from 'constants/modes';
import ScreenContext from 'contexts/ScreenContext';
import withSelector from 'components/hoc/withSelector';
import Viewport from 'components/pixi/base/Viewport';
import Edges from 'components/pixi/Edges';
import Sprites from 'components/pixi/Sprites';
import Vertices from 'components/pixi/Vertices';
import { GRAB, GRABBING } from 'constants/cursors';

const selector = ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  scale,
}) => ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  textureSources,
  scale,
});

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
    ...restProps
  } = props;
  const viewport = useRef(null);
  const { loader, renderer } = usePixiApp();
  const { plugins: { interaction } } = renderer;
  const [cursor, setCursor] = useState(GRAB);
  // const {
  //   textureSources = [],
  // } = props;
  // const context = useContext(ScreenContext);
  // renderer.plugins.interaction.moveWhenInside = true;
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

  return (
    <Viewport
      name="Interactive Viewport"
      ref={viewport}
      drag={{ keyToPress: 'ControlLeft' }}
      pinch={{ percent: 10 }}
      wheel={{ percent: 0.05 }}
      onzoomed={({ viewport: { scale: { x, y } } }) => dispatch(scaleUI({ x, y }))}
      interaction={interaction}
      cursor={cursor}
      pointerdown={() => setCursor(GRABBING)}
      pointerup={() => setCursor(GRAB)}
      screenHeight={screenHeight}
      screenWidth={screenWidth}
      {...restProps}
    >
      <Sprites />
      <Edges
        interactive={mode === Modes.EDGE}
        interactiveChildren={mode === Modes.EDGE}
        scale={scale}
        setCursor={setCursor}
      />
      <Vertices
        interactive={mode === Modes.VERTEX}
        interactiveChildren={mode === Modes.VERTEX}
        width={screenWidth}
        height={screenHeight}
        scale={scale}
        setCursor={setCursor}
      />
    </Viewport>
  );
};

export default withSelector(ScreenContext, selector)(InteractiveViewport);
