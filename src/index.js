import React from 'react';
import { render } from 'react-dom';
import { AppContext } from 'react-pixi-fiber';
import { Provider } from "react-redux";

import { resize } from 'App/actions/action';
import App from 'App/components/App';
import Test from 'App/components/Test';
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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
        }}>
            <Test />
            <div className="controls">
                <form>
                    <label>{store.getState().lastResize}</label>
                </form>
            </div>
        </div>,
    appContainer
);
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
