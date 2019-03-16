// /src/js/tools/data.js

export const pixiHandlersToEvents = {
    'onAdded' : 'added',
    'onClick' : 'click',
    'onMouseDown' : 'mousedown',
    'onMouseMove' : 'mousemove',
    'onMouseOver' : 'mouseover',
    'onMouseUp' : 'mouseup',
    'onMouseUpOutside' : 'mouseupoutside',
    'onPointerCancel' : 'pointercancel',
    'onPointerDown' : 'pointerdown',
    'onPointerMove' : 'pointermove',
    'onPointerOut' : 'pointerout',
    'onPointerOver' : 'pointerover',
    'onPointerTap' : 'pointertap',
    'onPointerUp' : 'pointerup',
    'onPointerUpOutside' : 'pointerupoutside',
    'onRemoved' : 'removed',
    'onRightClick' : 'rightclick',
    'onRightDown' : 'rightdown',
    'onRightUp' : 'rightup',
    'onRightUpOutside' : 'rightupoutside',
    'onTap' : 'tap',
    'onTouchCancel' : 'touchcancel',
    'onTouchEnd' : 'touchend',
    'onTouchEndOutside' : 'touchendoutside',
    'onTouchMove' : 'touchmove',
    'onTouchStart' : 'touchstart',
};

// update listeners on a custom pixi component. call in `customApplyProps`
export const updateListeners = (instance, oldProps, newProps) => {
    // get just the listener props from oldProps
    const oldEventListeners = Object.entries(oldProps).reduce(
        (listeners, [event, listener]) => event in pixiHandlersToEvents ?
            { ...listeners, [pixiHandlersToEvents[event]]: listener } : listeners,
        {}
    );

    // get just the listener props from newProps
    const newEventListeners = Object.entries(newProps).reduce(
        (listeners, [event, listener]) => event in pixiHandlersToEvents ?
            { ...listeners, [pixiHandlersToEvents[event]]: listener } : listeners,
        {}
    );

    // update the component's event listeners in case on has been added, removed, or changed.
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

    // remove old listeners that weren't passed in newProps
    Object.entries(oldEventListeners).forEach(([event, listener]) => {
        if (!newEventListeners.hasOwnProperty(event)) {
            instance.off(event, listener);
        }
    });
};

export default {
    pixiHandlersToEvents,
    updateListeners,
};
