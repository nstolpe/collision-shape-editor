// src/js/components/Rectangle.js

import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

import { updateListeners } from  'App/tools/custom-pixi-component';

const TYPE = 'Rectangle';

const defaults = {
    interactive: false,
    buttonMode: false,
    fill: 0xffffff,
    x: 0,
    y: 0,
    rotation: 0,
    pivot: [0, 0],
    width: 0,
    height: 0,
    alpha: 1,
    strokeWidth: 0,
    strokeColor: 0x000000,
    strokeAlpha: 1.0,
    strokeAlignment: 0,
};

export const behavior = {
    customDisplayObject: props => new PIXI.Graphics(),
    customApplyProps: function(instance, oldProps, newProps) {
        const {
            fill,
            strokeWidth,
            strokeColor,
            strokeAlpha,
            strokeAlignment,
            x,
            y,
            width,
            height,
            interactive,
            buttonMode,
            alpha,
            position,
            rotation,
            pivot,
        } = { ...defaults, ...newProps };

        instance.alpha = alpha;

        instance.lineStyle(strokeWidth, strokeColor, strokeAlpha, strokeAlignment);
        instance.pivot.set(...pivot);
        instance.position.set(x, y);
        instance.rotation = rotation;

        instance.clear();
        instance.beginFill(fill);
        instance.drawRect(0, 0, width, height);
        instance.endFill();

        this.applyDisplayObjectProps(oldPropsRest, newPropsRest);
    }
};

export default CustomPIXIComponent(behavior, TYPE);
