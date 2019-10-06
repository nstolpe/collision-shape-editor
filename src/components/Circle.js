// src/js/components/Circle.js

import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

const TYPE = 'Circle';

// const defaults = {
//     interactive: false,
//     buttonMode: false,
//     fill: 0xffffff,
//     x: 0,
//     y: 0,
//     radius: 0,
//     pivot: [0, 0],
//     scale: [1, 1],
//     alpha: 1,
//     strokeWidth: 0,
//     strokeColor: 0x000000,
//     strokeAlpha: 1.0,
//     strokeAlignment: 0,
// };
const oldPropsKeys = [
    'fill',
    'strokeAlignment',
    'strokeAlpha',
    'strokeColor',
    'strokeWidth',
    'radius',
];

export const behavior = {
    customDisplayObject: props => new PIXI.Graphics(),
    customApplyProps: function(instance, oldProps, newProps) {
        const {
            fill,
            strokeAlignment,
            strokeAlpha,
            strokeColor,
            strokeWidth,
            radius,
            ...newPropsRest
        } = newProps;

        const oldPropsRest = Object.entries(oldProps).reduce((target, [prop, propValue]) => {
            if (!oldPropsKeys.includes(prop)) {
                target[prop] = propValue;
            }
            return target;
        }, {});

        if (typeof oldProps !== "undefined") {
          instance.clear();
        }

        instance.lineStyle(strokeWidth, strokeColor, strokeAlpha, strokeAlignment);
        instance.beginFill(fill);
        instance.drawCircle(0, 0, radius);
        instance.endFill();

        this.applyDisplayObjectProps(oldPropsRest, newPropsRest);
    }
};

export default CustomPIXIComponent(behavior, TYPE);
