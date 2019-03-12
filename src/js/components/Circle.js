// src/js/components/Circle.js

import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

import { pixiHandlersToEvents } from  'App/tools/data';

window.PIXI = PIXI;
const TYPE = 'Circle';

const updateListeners = (instance, oldProps, newProps) => {
    const oldEventListeners = Object.entries(oldProps).reduce(
        (listeners, [event, listener]) => event in pixiHandlersToEvents ?
            { ...listeners, [pixiHandlersToEvents[event]]: listener } : listeners,
        {}
    );

    const newEventListeners = Object.entries(newProps).reduce(
        (listeners, [event, listener]) => event in pixiHandlersToEvents ?
            { ...listeners, [pixiHandlersToEvents[event]]: listener } : listeners,
        {}
    );

    Object.entries(newEventListeners).forEach(([event, listener]) => {
        if (oldEventListeners.hasOwnProperty(event)) {
            if (oldEventListeners[event] !== listener) {
                instance.off(event, oldEventListeners[event]);
                instance.on(event, listener);
                delete oldEventListeners[event];
            }
        } else {
            instance.on(event, listener);
        }
    });

    Object.entries(oldEventListeners).forEach(([event, listener]) => {
        if (!newEventListeners.hasOwnProperty(event)) {
            instance.off(event, listener);
        }
    });
};

const defaults = {
    interactive: false,
    buttonMode: false,
    fill: 0xffffff,
    x: 0,
    y: 0,
    radius: 0,
    pivot: [0, 0],
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
            radius,
            interactive,
            buttonMode,
            alpha,
            position,
            pivot,
        } = { ...defaults, ...newProps };

        instance.interactive = !!interactive;
        instance.buttonMode = !!buttonMode;
        instance.alpha = alpha;

        instance.lineStyle(strokeWidth, strokeColor, strokeAlpha, strokeAlignment);
        instance.pivot.set(...pivot);
        instance.position.set(x, y);

        instance.clear();
        instance.beginFill(fill);
        instance.drawCircle(0, 0, radius);
        instance.endFill();

        updateListeners(instance, oldProps, newProps);
    }
};

export default CustomPIXIComponent(behavior, TYPE);
