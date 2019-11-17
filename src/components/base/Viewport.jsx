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

export const propGrouprules = [
    {
        group: 'eventProps',
        test: propName => Object.keys(EVENT_BY_PROPNAME).includes(propName),
    },
    {
        group: 'pluginProps',
        test: propName => PLUGIN_PROPS.includes(propName),
    },
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
            eventProps,
            pluginProps,
            restProps: {
                screenWidth,
                screenHeight,
                worldWidth,
                worldHeight,
                ...newPropsRest
            },
        } = groupProps(newProps, propGrouprules);

        const {
            restProps: {
                screenWidth: oldScreenWidth,
                screenHeight: oldScreenHeight,
                worldWidth: oldWorldWidth,
                worldHeight: oldWorldHeight,
                ...oldPropsRest
            }
        } = groupProps(oldProps, propGrouprules);

        instance.resize(screenWidth, screenHeight, worldWidth, worldHeight);

        Object.entries(eventProps).forEach(([propName, prop]) => updateEventProp(instance, propName, prop, oldProps[propName]));
        Object.entries(pluginProps).forEach(([propName, prop]) => updatePluginProp(instance, propName, prop, oldProps[propName]));

        this.applyDisplayObjectProps(oldPropsRest, newPropsRest);
    },
};

/**
 *
 * @param {Object} props  React props object.
 * @param {Object[]} rules         Prop groups and rules for sorting into them
 * @param {string} rules[].group   Name of the prop group
 * @param {function} rules[].test  Function that will evaluate the `propName` based on some
 *                                 internal criteria. Takes the prop name as its single argument.
 */
export const groupProps = (props, rules) => {
    // const groups = rules.reduce((groups, { group, test}) => { ...groups, [group]: {} }, {});

    return Object.entries(props).reduce((mappedProps, [propName, prop]) => {
        let grouped = false;

        for (let i = 0, l = rules.length; i < l; i++) {
            const { group, test } = rules[i];

            // add the group key to mappedProps if it's not there yet.
            if (!mappedProps.hasOwnProperty(group)) {
                mappedProps[group] = {};
            }

            // if the propName passes its first test, add it to the group and exit.
            if (test(propName)) {
                mappedProps[group][propName] = prop;
                grouped = true;
                break;
            }
        }

        // if the prop wasn't grouped in the loop above, add it to restProps
        if (!grouped) {
            mappedProps.restProps[propName] = prop;
        }

        return mappedProps;
    }, { restProps: {} });
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

export default CustomPIXIComponent(behavior, TYPE);
