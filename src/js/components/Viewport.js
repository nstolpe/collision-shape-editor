// src/js/components/Viewport.js
import {
    CustomPIXIComponent,
    withApp,
} from "react-pixi-fiber";
import { connect } from "react-redux";
import * as PIXI from "pixi.js";
import Viewport from 'pixi-viewport';

import { scaleUI } from 'App/actions/actions';
import ScreenContext from 'App/contexts/ScreenContext';

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
    scaleUI: ({ x, y }) => dispatch(scaleUI({ x, y })),
    // addVertex: ({x, y }) => dispatch(addVertex({ x, y })),
});

const behavior = {
    customDisplayObject: function(props) {
        const { app: { renderer }, backgroundColor } = props;
        const instance = new Viewport({ ...props });
        instance.on('zoomed', e => props.scaleUI(e.viewport.scale));
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
        instance.on('pointertap', props.pointertap);
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
        const { app: { renderer }, backgroundColor } = newProps;

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
        // this.applyDisplayObjectProps(oldProps,newProps)
    },
};

// export default connect(mapDispatchToProps, mapDispatchToProps)(CustomPIXIComponent(behavior, TYPE));
// export default CustomPIXIComponent(behavior, TYPE);
export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(withApp(CustomPIXIComponent(behavior, TYPE)));
