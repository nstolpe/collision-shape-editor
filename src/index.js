import React from 'react';
import { render } from 'react-dom';
import { AppContext, Stage } from 'react-pixi-fiber';
import { Provider } from "react-redux";

import { resize } from 'App/actions/action';
import App from 'App/components/App';
import ContextBridge from 'App/components/ContextBridge';
import Test from 'App/components/Test';
import TestContainer from 'App/components/TestContainer';
import store from 'App/store/store';

const appContainer = document.getElementById('app-container');
const ControlContext = React.createContext();

store.dispatch(resize({
    width: appContainer.offsetWidth,
    height: appContainer.offsetHeight,
    lastResize: Date.now(),
}));
window.store = store;
const context = React.createContext();
render(
    <ContextBridge
        barrierRender={children => (
            <Stage>{children}</Stage>
        )}
    >
        <TestContainer />

    </ContextBridge>,
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
//             <Test />
//             <div className="controls">
//                 <form>
//                     <label>{store.getState().lastResize}</label>
//                 </form>
//             </div>
//         </div>
//     </Provider>,
//     appContainer
// );
// render(
//     <Provider context={context} store={store}>
//         <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             width: '100%',
//             height: '100%',
//         }}>
//             <App context={context}/>
//             <ControlContext.Provider store={store}>
//                 <div className="controls">
//                     <form>
//                         <label>foo</label>
//                     </form>
//                 </div>
//             </ControlContext.Provider>
//         </div>
//     </Provider>,
//     appContainer
// );
