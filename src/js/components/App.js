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
const foo = app => {
    const texture = PIXI.Texture.fromImage(turtleBodySrc);
    console.log(texture.width, texture.width)
    console.log('foo');
    app.stage.position.set(app.screen.width / 2, app.screen.height / 2);
    console.log(typeof turtleBodySrc)
    return (
        <Container
            // pivot="0.5"
        >
            <Sprite texture={texture} pivot={[43, 60]}/>
        </Container>
    );
};
const overlay = props => {
    console.log(props.app);
    return (
        <Container
            name="overlay"
            hitArea={new PIXI.Rectangle(0, 0, props.app.stage.width, props.app.stage.height)}
            width={props.width}
            height={props.height}
        ></Container>
    );
};
const mapStateToProps = state => ({ ...state });
const App = props => (
    <Stage
        width={props.width}
        height={props.height}
        options={
            {
                backgroundColor: 0x00ff3b,
                autoResize: true,
                resolution: props.resolution,
            }
        }
        style={{
            width: '100%',
            height: '100%',
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
            {app => overlay({ ...props, app })}
        </AppContext.Consumer>
        <AppContext.Consumer>
            {app => foo(app)}
        </AppContext.Consumer>
    </Stage>
);

export default connect(mapStateToProps)(App);
