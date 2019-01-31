import React from 'react';
import * as PIXI from 'pixi.js';
import { connect } from "react-redux";
import {
    AppContext,
    Container,
    Sprite,
    Stage,
} from 'react-pixi-fiber';
import turtleBodySrc from '../../img/turtle-body.png';

const mapStateToProps = state => ({ ...state });
const App = props => (
    <Stage
        width={props.width}
        height={props.height}
        options={
            {
                backgroundColor: 0x00ff3b,
                autoResize: true,
            }
        }
        style={{
            // position: 'absolute',
            // top: 0,
            // bottom: 0,
            // left: 0,
            // right: 0,
            width: '100%'
        }}
        position='absolute'
        hitArea={new PIXI.Rectangle(0, 0, props.width, props.height)}
        width={props.width}
        height={props.height}
        interactive
        buttonMode
        pointerdown={e => console.log(e)}
    >
        <AppContext.Consumer>
            {app => (
                <Container>
                    <Sprite texture={PIXI.Texture.fromImage(turtleBodySrc)} />
                </Container>
            )}
        </AppContext.Consumer>
    </Stage>
);

export default connect(mapStateToProps)(App);
