import React from 'react';
import { render } from 'react-dom';
import { AppContext } from 'react-pixi-fiber';
import { Provider } from "react-redux";
import store from 'App/store/store';
import App from 'App/components/App';

const appContainer = document.getElementById('app-container');
const ControlContext = React.createContext();
render(
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    }}>
        <App
            width={appContainer.offsetWidth}
            height={appContainer.offsetHeight}
        />
        <ControlContext.Provider store={store}>
            <div className="controls">
                <form>
                    <label>foo</label>
                </form>
            </div>
        </ControlContext.Provider>
    </div>,
    appContainer
);
