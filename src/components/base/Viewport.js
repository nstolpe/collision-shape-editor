// src/js/components/base/Viewport.js
import deepEqual from 'deep-equal';
import { CustomPIXIComponent } from "react-pixi-fiber";
import { Viewport } from 'pixi-viewport'

export const TYPE = "Viewport";

// props:
// screenWidth
// screenHeight
// worldWidth
// worldHeight
// interaction = app.renderer.interaction
export const EVENT_BY_PROPNAME = {
    onbouncexend: 'bounce-x-end',
    onbouncexstart: 'bounce-x-start',
    onbounceyend: 'bounce-y-end',
    onbounceystart: 'bounce-y-start',
    onclicked: 'clicked',
    ondragend: 'drag-end',
    ondragstart: 'drag-start',
    onframeend: 'frame-end',
    onmouseedgeend: 'mouse-edge-end',
    onmouseedgestart: 'mouse-edge-start',
    onmoved: 'moved',
    onmovedend: 'moved-end',
    onpinchend: 'pinch-end',
    onpinchstart: 'pinch-start',
    onsnapend: 'snap-end',
    onsnapstart: 'snap-start',
    onsnapzoomend: 'snap-zoom-end',
    onsnapzoomstart: 'snap-zoom-start',
    onwheel: 'wheel',
    onwheelscroll: 'wheel-scroll',
    onzoomed: 'zoomed',
    onzoomedend: 'zoomed-end',
};

export const PLUGIN_PROPS = [
    'bounce',
    'clamp',
    'clampZoom',
    'decelerate',
    'drag',
    'follow',
    'mouseEdges',
    'pinch',
    'snap',
    'snapZoom',
    'wheel',
];

export const behavior = {
    customDisplayObject: props => {
        const { app: { renderer }, ...rest } = props;
        const instance = new Viewport({ interaction: renderer.plugins.interaction, ...rest });
        // instance.on('pointertap', e => {
        //     switch (true) {
        //         case props.ctrlPressed && !props.altPressed:
        //             const coordinates = e.data.getLocalPosition(e.currentTarget);
        //             props.dispatch(addVertex(coordinates));
        //             break;
        //         default:
        //             break;
        //     }
        // });

        return instance;
    },
    customApplyProps: function(instance, oldProps, newProps) {
        const {
            screenWidth,
            screenHeight,
            worldWidth,
            worldHeight,
            ...newPropsRest
        } = Object.entries(newProps)
                .filter(([propName, prop]) => (
                    !Object.keys(EVENT_BY_PROPNAME).includes(propName) && !PLUGIN_PROPS.includes(propName)
                ))
                .reduce((props, [propName, prop]) => ({ ...props, [propName]: prop }), {});
        const {
            app,
            screenWidth: oldScreenWidth,
            screenHeight: oldScreenHeight,
            worldWidth: oldWorldWidth,
            worldHeight: oldWorldHeight,
            ...oldPropsRest
        } = Object.entries(oldProps)
                .filter(([propName, prop]) => (
                    !Object.keys(EVENT_BY_PROPNAME).includes(propName) && !PLUGIN_PROPS.includes(propName)
                ))
                .reduce((props, [propName, prop]) => ({ ...props, [propName]: prop }), {});

        instance.resize(screenWidth, screenHeight, worldWidth, worldHeight);

        Object.entries(newProps).forEach(([propName, prop]) => {
            updateEventProp(instance, propName, prop, oldProps[propName])
            updatePluginProp(instance, propName, prop, oldProps[propName]);
        });

        this.applyDisplayObjectProps(oldPropsRest, newPropsRest);
    },
};

export const updatePluginProp = (instance, pluginName, options, oldOptions) => {
    // @TODO do something better for shallow comparison
    if (PLUGIN_PROPS.includes(pluginName) && !deepEqual(options, oldOptions)) {
        Object.entries(options).length ? instance[pluginName](options) : instance[pluginName]();
    }
};

export const updateEventProp = (instance, propName, prop, oldProp) => {
    if (Object.keys(EVENT_BY_PROPNAME).includes(propName)) {
        const eventName = EVENT_BY_PROPNAME[propName];
        const listener = prop;

        instance.off(eventName, oldProp);
        instance.on(eventName, listener);
    }
};

// export const updateEventProp = (instance, propName, prop, oldProp) => {
//     const eventName = EVENT_BY_PROPNAME[propName];
//     const listener = prop;

//     instance.off(eventName, oldProp);
//     instance.on(eventName, listener);
// };

export default CustomPIXIComponent(behavior, TYPE);
