import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";

import store from 'App/store/store';
import App from 'App/components/App';

const appContainer = document.getElementById('app-container');

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
            <App
                width={appContainer.offsetWidth}
                height={appContainer.offsetHeight}
            />
        </div>
        <div className="controls">
            <form>
                <label>foo</label>
            </form>
        </div>
    </Provider>,
    appContainer
);
