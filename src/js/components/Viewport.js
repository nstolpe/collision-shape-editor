// src/js/components/Viewport.js
import { CustomPIXIComponent } from "react-pixi-fiber";
import { connect } from "react-redux";
import * as PIXI from "pixi.js";
import Viewport from 'pixi-viewport';

const TYPE = "Viewport";

// props:
// screenWidth
// screenHeight
// worldWidth
// worldHeight
// interaction = app.renderer.interaction
const mapStateToProps = state => ({ ...state });

const behavior = {
    customDisplayObject: function(props) {
        return new Viewport({ ...props });
    },
    customDidAttach: (instance, oldProps, newProps) => {
        instance.on('zoomed', e => console.log('zoomed', e, e.viewport.scale.x))
        // instance.on('zoomed-end', e => console.log('zoomed-end', e))
        // instance.on('wheel', e => console.log('wheel', e))
        // instance.on('wheel-scroll', e => console.log('wheel-scroll', e))
        instance
            .drag()
            .pinch()
            .wheel()
            .decelerate()
            .on('clicked', e => console.log('viewport clicked', e))
            .resize();
    },
};

export default CustomPIXIComponent(behavior, TYPE);
