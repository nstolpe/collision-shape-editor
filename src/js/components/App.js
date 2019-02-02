// components/App.js

import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
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
    addVertex,
    resize,
    setAltPressed,
    setCtrlPressed,
} from 'App/actions/action';
import store from 'App/store/store';
import turtleBodySrc from '../../img/turtle-body.png';

window.store = store;

const image = props => {
    const { app } = props;
    const texture = PIXI.Texture.fromImage(turtleBodySrc);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
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


const App = (props) => {
    const focusTarget = useRef(null);
    const [buttonMode, setButtonMode] = useState(false);

    const keyDown = e => {
        switch(e.key) {
            case "Alt":
                store.dispatch(setAltPressed(true))
                break;
            case "Control":
                setButtonMode(true);
                store.dispatch(setCtrlPressed(true))
                break;
            default:
                break;
        }
    };

    const keyUp = e => {
        switch(e.key) {
            case "Alt":
                store.dispatch(setAltPressed(false))
                break;
            case "Control":
                setButtonMode(false);
                store.dispatch(setCtrlPressed(false))
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        focusTarget.current.focus()
    });

    return (
        <div
            style={{
                flex: 1,
                overflow: 'hidden',
            }}
            onKeyDown={keyDown}
            onKeyUp={keyUp}
            ref={focusTarget}
            tabIndex={1}
        >
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
                hitArea={new PIXI.Rectangle(0, 0, props.width, props.height)}
                width={props.width}
                height={props.height}
                interactive
                buttonMode={buttonMode}
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
                                    switch (true) {
                                        case e.data.originalEvent.ctrlKey && !e.data.originalEvent.altKey:
                                            const coordinates = e.data.getLocalPosition(e.currentTarget);
                                            store.dispatch(addVertex(coordinates));
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            >
                                {image({ ...props, app })}
                                <Container
                                    name="edges-container"
                                >
                                  <Edges {...props} pointerdown={e=>console.log(e)}/>
                                  <Vertices {...props} />
                                </Container>
                            </Viewport>
                        </Provider>
                    )}
                </AppContext.Consumer>
            </Stage>
        </div>
    )
};

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
