// components/App.js
// Deprecated. reference only.
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
import Viewport from 'App/components/base/Viewport';
import {
  addVertex,
  resize,
  scaleUI,
  setAltPressed,
  setCtrlPressed,
} from 'App/actions/actions';
import store from 'App/store/store';
import turtleBodySrc from '../../img/turtle-body.png';

window.store = store;

const image = props => {
  const { app } = props;
  const texture = PIXI.Texture.fromImage(turtleBodySrc);
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
  // all should come through loader
  // const pivot = [43, 60];
  const pivot = [0,0];
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
  // const [buttonMode, setButtonMode] = useState(false);
  // const [altPressed, setAltPressed] = useState(false);
  // const [ctrlPressed, setCtrlPressed] = useState(false);

  const keyDown = e => {
    switch(e.key) {
      case "Alt":
        store.dispatch(setAltPressed(true));
        // setAltPressed(true);
        break;
      case "Control":
        // setButtonMode(true);
        // setCtrlPressed(true);
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
        // setAltPressed(false);
        break;
      case "Control":
        // setCtrlPressed(false);
        // setButtonMode(false);
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
        options={{
          backgroundColor: 0x05ffd5,
          autoResize: true,
          resolution: props.resolution,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        hitArea={new PIXI.Rectangle(0, 0, props.width, props.height)}
        width={props.width}
        height={props.height}
        interactive
        // buttonMode={buttonMode}
        // cursor="grab"
        // cursor={props.ctrlPressed ? "pointer" : "grab"}
      >
        <AppContext.Consumer>{app => (
          <Viewport
            screenWidth={app.stage.width}
            screenHeight={app.stage.height}
            worldWidth={props.width}
            worldHeight={props.height}
            interaction={app.renderer.plugins.interaction}
            // cursor={store.getState().ctrlPressed ? "pointer" : "grab"}
            pointertap={e => {
              switch (true) {
                case store.getState().ctrlPressed && !store.getState().altPressed:
                  const coordinates = e.data.getLocalPosition(e.currentTarget);
                  store.dispatch(addVertex(coordinates));
                  break;
                default:
                  break;
              }
            }}
            scaleUI={props.scaleUI}
            { ...props }
          >
            {image({ ...props, app })}
            <Container name="edges-container">
              <Edges {...props} pointerdown={e=>console.log(e)}/>
              <Vertices />
            </Container>
          </Viewport>
        )}</AppContext.Consumer>
      </Stage>
    </div>
  );
};

window.addEventListener('resize', e => {
  const now = Date.now();
  const last = store.getState().lastResize;
  const appContainer = document.getElementById('app-container');
console.log('foo')
  if (!last  || now - last > 250) {
    store.dispatch(resize({
      width: appContainer.offsetWidth,
      height: appContainer.offsetHeight,
      lastResize: now,
    }));
  }
});

window.dispatchEvent(new Event('resize'));

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  scaleUI: ({ x, y }) => dispatch(scaleUI({ x, y })),
  addVertex: ({x, y }) => dispatch(addVertex({ x, y })),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
