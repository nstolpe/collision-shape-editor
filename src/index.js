import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";

import App from './js/components/App';

const appContainer = document.getElementById('app-container');

const RESIZE = 'RESIZE';

const resize = ({
    width,
    height,
}) => ({
    type: RESIZE,
    payload: {
        width,
        height,
    }
});

const initialState = {
    width: appContainer.offsetWidth,
    height: appContainer.offsetHeight,
    resolution: window.devicePixelRation,
    lastResize: Date.now(),
    images: {
        default: 'turtle-body.png',
    },
};

const store = createStore(
    (state = initialState, action) => {
        switch (action.type) {
            case RESIZE:
                return {
                    ...state,
                    ...action.payload
                }
            default:
                return state;
        }
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
    <Provider store={store}>
        <div
            className="app"
            style={
                {
                    flex: 1,
                    overflow: 'hidden',
                }
            }
        >
            <App />
        </div>
        <div className="controls">
            <form>
                <label>foo</label>
            </form>
        </div>
    </Provider>,
    appContainer
);

window.addEventListener('resize', e => {
    const now = Date.now();
    const last = store.getState().lastResize;

    if (now - last > 250) {
        store.dispatch(resize({
            width: appContainer.offsetWidth,
            height: appContainer.offsetHeight - document.querySelector('.controls').offsetHeight,
            lastResize: now,
        }));
    }
});

window.dispatchEvent(new Event('resize'));
