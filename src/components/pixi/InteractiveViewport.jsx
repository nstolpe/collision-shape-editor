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
import Geometry from 'components/pixi/Geometry';
import { GRAB, GRABBING } from 'constants/cursors';
import usePointerInteractions from 'hooks/usePointerInteractions';

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
  { scale, vertices, ...restProps},
  { scale: oldScale, vertices: oldVertices, ...restOldProps }
) => {
  if (
    (scale?.x ?? scale?.[0] ?? scale) !== (oldScale?.x ?? oldScale?.[0] ?? oldScale) ||
    (scale?.y ?? scale?.[1] ?? scale) !== (oldScale?.y ?? oldScale?.[1] ?? oldScale)
  ) {
    return false;
  }

  if (vertices?.length !== oldVertices?.length) {
    return false;
  }

  for (let i = 0, l = vertices?.length; i < l; i++) {
    const vertex = vertices[i];
    const oldVertex = oldVertices[i];

    if (
      vertex.name !== oldVertex.name ||
      vertex.x !== oldVertex.x ||
      vertex.y !== oldVertex.y
    ) {
      return false;
    }
  }

  for (let i = 0, l = restProps.length; i < l; i++) {
    const prop = restProps[i];
    const oldProp = restOldProps[i];

    if (prop !== oldProp) {
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
  const viewport = useRef(null);
  const { loader, renderer } = usePixiApp();
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
  } = usePointerInteractions(dispatch, tool, vertices);
  const onZoomed = ({
    viewport: {
      scale: { x, y },
    },
  }) => dispatch(scaleUI({ x, y }));
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
      pinch={{ percent: 1 }}
      wheel={{ percent: 0.05 }}
      onzoomed={onZoomed}
      interaction={interaction}
      cursor={cursor}
      pointerdown={onPointerDown}
      pointerup={onPointerUp}
      screenHeight={screenHeight}
      screenWidth={screenWidth}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointermove={handlePointerMove}
      {...restProps}
    >
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
