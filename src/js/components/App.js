// components/App.js

import React from 'react';
import * as PIXI from 'pixi.js';
import {
    connect,
    Provider,
} from "react-redux";
import {
    AppContext,
    Container,
    Sprite,
    Stage,
} from 'react-pixi-fiber';
import Edges from 'App/components/Edges';
import Vertices from 'App/components/Vertices';
import Viewport from 'App/components/Viewport';
import {
    resize,
    addVertex,
} from 'App/actions/action';
import store from 'App/store/store';
import turtleBodySrc from '../../img/turtle-body.png';

window.store = store;

const image = props => {
    const { app } = props;
    const texture = PIXI.Texture.fromImage(turtleBodySrc);
    // all should come through loader
    const pivot = [43, 60];
    return (
        <Container
            name="image-container"
            position={[app.screen.width / 2, app.screen.height / 2]}
        >
            <Sprite name="image" texture={texture} pivot={pivot}/>
        </Container>
    );
};

const edges = props => (
    <Container
        name="edges-container"
    >
      <Edges {...props} />
      <Vertices {...props} />
    </Container>
);

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({ addVertex: ({ x, y }) => dispatch(addVertex({ x, y })) });

const App = props => (
    <Stage
        width={props.width}
        height={props.height}
        options={
            {
                backgroundColor: 0x05ffd5,
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
    >
        <AppContext.Consumer>
            {app => (
                <Provider store={store}>
                    <Viewport
                        screenWidth={props.width}
                        screenHeight={props.height}
                        worldWidth={props.width}
                        worldHeight={props.height}
                        interaction={app.renderer.plugins.interaction}
                        pointertap={function(e) {
                            console.log('stage');
                            console.log(e.data.global);
                            const vertex = e.data.getLocalPosition(e.currentTarget);
                            store.dispatch(addVertex(vertex));
                        }}
                    >
                        {image({ ...props, app })}
                        {edges({ ...props, app })}
                    </Viewport>
                </Provider>
            )}
        </AppContext.Consumer>
    </Stage>
);

window.addEventListener('resize', e => {
    const now = Date.now();
    const last = store.getState().lastResize;
    const appContainer = document.getElementById('app-container');

    if (!last  || now - last > 250) {
        store.dispatch(resize({
            width: appContainer.offsetWidth,
            height: appContainer.offsetHeight,
            lastResize: now,
        }));
    }
});

window.dispatchEvent(new Event('resize'));

// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
