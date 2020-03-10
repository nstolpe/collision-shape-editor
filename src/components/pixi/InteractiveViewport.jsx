// src/js/components/pixi/InteractiveViewport.js
import * as PIXI from 'pixi.js';
import React, { useEffect, useContext, useRef, useState, Children, cloneElement } from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import {
  addSprite,
  removeTextureSource,
  scaleUI,
} from 'actions/actions';
import Modes from 'constants/modes';
import ScreenContext, { useScreenContext } from 'contexts/ScreenContext';
import Viewport from 'components/pixi/base/Viewport';
import Edges from 'components/pixi/Edges';
import Sprites from 'components/pixi/Sprites';
import Vertices from 'components/pixi/Vertices';
import { GRAB, GRABBING } from 'constants/cursors';

/**
 * `pixi-viewport` component.
 */
const InteractiveViewport = props => {
  const {
    children,
    ...restProps
  } = props;
  const viewport = useRef(null);
  const { loader, renderer } = usePixiApp();
  const { plugins: { interaction } } = renderer;
  const {
    dispatch,
    backgroundColor,
    mode,
    tool,
    textureSources,
    scale,
  } = useScreenContext();
  const [cursor, setCursor] = useState(GRAB);
  // const {
  //     textureSources = [],
  //     backgroundColor,
  //     removeTextureSource,
  //     // app: { loader, renderer },
  //     addSprite,
  //     screenWidth,
  //     screenHeight,
  // } = props;
  // const context = useContext(ScreenContext);
  renderer.plugins.interaction.moveWhenInside = true;
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
            x: props.screenWidth * 0.5,
            y: props.screenHeight * 0.5,
            rotation: 0,
            scale: [1, 1],
            scaleMode: PIXI.SCALE_MODES.NEAREST,
          });
        });
      });
    },
    [textureSources, addSprite, loader, removeTextureSource, props.screenHeight, props.screenWidth]
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
      name={'InteractiveViewport'}
      cursor={cursor}
      pointerdown={() => setCursor(GRABBING)}
      pointerup={() => setCursor(GRAB)}
      {...props}
    >
      <Sprites />
      <Edges
        interactive={mode === Modes.EDGE}
        interactiveChildren={mode === Modes.EDGE}
        active={mode === Modes.EDGE}
        scale={scale}
        setCursor={setCursor}
      />
      <Vertices
        interactive={mode === Modes.VERTEX}
        interactiveChildren={mode === Modes.VERTEX}
        width={props.screenWidth}
        height={props.screenHeight}
        scale={scale}
        setCursor={setCursor}
      />
    </Viewport>
  );
};

export default InteractiveViewport;
