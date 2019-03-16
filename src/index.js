import React, { useEffect } from 'react';
import { render } from 'react-dom';
import {
    AppContext,
    Container,
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
    setBackgroundColor,
} from 'App/actions/actions';
// import App from 'App/components/App';
import AppWrapper from 'App/components/AppWrapper';
import ColorPicker from 'App/components/ColorPicker';
import Controls from 'App/components/Controls';
import Screen from 'App/components/Screen';
import ScreenWrapper from 'App/components/ScreenWrapper';
import ScreenContext from 'App/contexts/ScreenContext';
import TestContainer from 'App/components/TestContainer';
import Viewport from 'App/components/Viewport';
import store from 'App/store/store';

const appContainer = document.getElementById('app-container');

store.dispatch(resize({
    width: appContainer.offsetWidth,
    height: appContainer.offsetHeight,
    lastResize: Date.now(),
}));

window.store = store;

const mapDispatchToProps = dispatch => ({
    onChange: e => {
        const colorString = e.target.value;
        const color = parseInt(colorString.replace('#', ''), 16);
        dispatch(setBackgroundColor(color));
    },
});

const ConnectedScreen = connect(state => state)(Screen);

// store used in both renderers
render(
    <Provider store={store}>
        <AppWrapper>
            <ScreenWrapper>
                <Screen context={ScreenContext}>
                    <Viewport>
                        <TestContainer />
                    </Viewport>
                </Screen>
            </ScreenWrapper>
            <Controls></Controls>
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
