// src/js/components/Viewport.js
import { CustomPIXIComponent } from "react-pixi-fiber";
import { connect } from "react-redux";
import * as PIXI from "pixi.js";
import Viewport from 'pixi-viewport';

import { scaleUI } from 'App/actions/action';

const TYPE = "Viewport";

// props:
// screenWidth
// screenHeight
// worldWidth
// worldHeight
// interaction = app.renderer.interaction
const mapDispatchToProps = dispatch => ({
    scaleUI: ({ x, y }) => dispatch(scaleUI({ x, y })),
});

const behavior = {
    customDisplayObject: function(props) {
        return new Viewport({ ...props });
    },
    customDidAttach: (instance, oldProps, newProps) => {
        instance.on('zoomed', e => instance.scaleUI(e.viewport.scale));
        instance
            .drag()
            .pinch()
            .wheel()
            .decelerate()
            .resize();
    },
};

export default connect(null, mapDispatchToProps)(CustomPIXIComponent(behavior, TYPE));
