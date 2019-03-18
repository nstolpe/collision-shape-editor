// src/js/components/Viewport.js
import {
    CustomPIXIComponent,
    withApp,
} from "react-pixi-fiber";
import { connect } from "react-redux";
import * as PIXI from "pixi.js";
import Viewport from 'pixi-viewport';

// import { addVertex } from 'App/actions/actions';
import ScreenContext from 'App/contexts/ScreenContext';
import {
    pixiHandlersToEvents,
    updateListeners,
} from  'App/tools/custom-pixi-component';

const TYPE = "Viewport";

// props:
// screenWidth
// screenHeight
// worldWidth
// worldHeight
// interaction = app.renderer.interaction
const mapStateToProps = state => {
    return { ...state }
};
const mapDispatchToProps = dispatch => ({
    // addVertex: ({x, y }) => dispatch(addVertex({ x, y })),
});

const behavior = {
    customDisplayObject: function(props) {
        const { app: { renderer }, backgroundColor, ...rest } = props;
        const instance = new Viewport({ ...rest, interaction: renderer.plugins.interaction });
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
        renderer.backgroundColor = backgroundColor;

        return instance;
    },
    customDidAttach: instance => {
        instance
            .drag()
            .pinch()
            .wheel({ percent: 0.05 })
            .resize();
    },
    customApplyProps: function(instance, oldProps, newProps) {
        const {
            app: { renderer },
            backgroundColor,
            screenWidth,
            screenHeight,
            worldWidth,
            worldHeight,
        } = newProps;

        instance.resize(screenWidth, screenHeight, worldWidth, worldHeight);

        if (backgroundColor !== oldProps.backgroundColor) {
            renderer.backgroundColor = backgroundColor;
        }

        switch (true) {
            case newProps.ctrlPressed:
                instance.cursor = "pointer";
                break;
            default:
                instance.cursor = "grab";
                break;
        }
        updateListeners(instance, oldProps, newProps, { ...pixiHandlersToEvents, onZoomed: 'zoomed' });
        // this.applyDisplayObjectProps(oldProps,newProps)
    },
};

export default CustomPIXIComponent(behavior, TYPE);
