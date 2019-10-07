// src/js/components/ScaleNearestSprite.js

import * as PIXI from 'pixi.js';
import React, {
    useEffect,
    useRef,
} from 'react';
import { Sprite } from 'react-pixi-fiber';

import ScreenContext from 'contexts/ScreenContext';

/**
 * A sprite component that has its scale mode set to NEAREST.
 */
const ScaleNearestSprite = props => {
    const sprite = useRef(null);
    props.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    useEffect(() => {
        sprite.current.pivot.set(sprite.width * 0.5, sprite.height * 0.5);
    });

    return (<Sprite ref={sprite} {...props} />);
};

export default ScaleNearestSprite;