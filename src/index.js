import React, { useEffect } from 'react';
import { render } from 'react-dom';
import {
    AppContext,
    Container,
    Sprite,
    Stage,
    withApp,
} from 'react-pixi-fiber';
import {
    connect,
    Provider,
    ReactReduxContext,
} from "react-redux";
import * as PIXI from 'pixi.js';
// import App from 'App/components/App';
// import ContextBridge from 'App/components/ContextBridge';
import {
    resize,
    scaleUI,
    setBackgroundColor,
} from 'App/actions/actions';

// components
// import App from 'App/components/App';
import AppWrapper from 'App/components/AppWrapper';
import Controls from 'App/components/Controls';
import FlexResizer from 'App/components/FlexResizer';
import Screen from 'App/components/Screen';
import Sprites from 'App/components/Sprites';
import ScreenContext from 'App/contexts/ScreenContext';
import TestContainer from 'App/components/TestContainer';

import store from 'App/store/store';

const appContainer = document.getElementById('app-container');

store.dispatch(resize({
    width: appContainer.offsetWidth,
    height: appContainer.offsetHeight,
    lastResize: Date.now(),
}));

window.store = store;

// const Sprite = props => {
//     const sprite =
//     return (<S/>)
// }
// store used in both renderers
render(
    <Provider store={store}>
        <AppWrapper>
            <FlexResizer>
                    <Screen context={ScreenContext}>
                        <TestContainer />
                        <Sprites />
                    </Screen>
            </FlexResizer>
            <Controls />
        </AppWrapper>
    </Provider>,
    appContainer
);

// render(
//     <Provider store={store}>
//         <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             width: '100%',
//             height: '100%',
//         }}>
//             <App />
//             <div className="controls">
//                 <form>
//                     <label>foo</label>
//                 </form>
//             </div>
//         </div>
//     </Provider>,
//     appContainer
// );
