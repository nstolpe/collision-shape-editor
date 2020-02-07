// src/js/components/InteractiveViewport.js
import * as PIXI from 'pixi.js';
import React, { useEffect, useContext, useRef, useState, Children, cloneElement } from 'react';
import { usePixiApp } from 'react-pixi-fiber';

import {
  addSprite,
  addVertex,
  removeTextureSource,
  scaleUI,
} from 'actions/actions';
import ScreenContext, { useScreenContext } from 'contexts/ScreenContext';
import Viewport from 'components/base/Viewport';
import Edges from 'components/Edges';
import Sprites from 'components/Sprites';
import Vertices from 'components/Vertices';
import { grab, grabbing } from 'utils/cursors';

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
    textureSources,
    screenWidth,
    screenHeight,
    scale,
  } = useScreenContext();
  const [cursor, setCursor] = useState(grab);
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
    [textureSources, addSprite, loader, removeTextureSource, screenHeight, screenWidth]
  );

  return (
    <Viewport
      ref={viewport}
      drag
      pinch={{ percent: 10 }}
      wheel={{ percent: 0.05 }}
      onzoomed={({ viewport: { scale: { x, y } } }) => dispatch(scaleUI({ x, y }))}
      interaction={interaction}
      name={'InteractiveViewport'}
      cursor={cursor}
      pointerdown={() => setCursor(grabbing)}
      pointerup={() => setCursor(grab)}
      pointertap={e => {
        const coordinates = e.data.getLocalPosition(e.currentTarget);
        dispatch(addVertex(coordinates));
      }}
      {...props}
    >
      <Sprites />
      <Edges scale={scale} setCursor={setCursor} />
      <Vertices scale={scale} setCursor={setCursor} />
    </Viewport>
  );
};

export default InteractiveViewport;
