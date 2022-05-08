// src/js/components/pixi/ScaleNearestSprite.js

import * as PIXI from 'pixi.js';
import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import { Sprite } from 'react-pixi-fiber';

/**
 * A sprite component that has its scale mode set to NEAREST.
 */
const ScaleNearestSprite = props => {
  const sprite = useRef(null);
  const [pivot, setPivot] = useState(0, 0);

  props.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  useEffect(() => {
    if (sprite.current) {
      setPivot([
        sprite.current.width * 0.5,
        sprite.current.height * 0.5,
      ]);
    }
  }, []);

  return (<Sprite ref={sprite} pivot={pivot} {...props} />);
};

export default ScaleNearestSprite;
