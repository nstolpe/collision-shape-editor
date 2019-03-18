import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";

// components
import AppWrapper from 'App/components/AppWrapper';
import Controls from 'App/components/Controls';
import FlexResizer from 'App/components/FlexResizer';
import Screen from 'App/components/Screen';
import Sprites from 'App/components/Sprites';
import ScreenContext from 'App/contexts/ScreenContext';

import store from 'App/store/store';

const appContainer = document.getElementById('app-container');

window.store = store;

render(
    <Provider store={store}>
        <AppWrapper>
            <FlexResizer>
                <Screen context={ScreenContext}>
                    <Sprites />
                </Screen>
            </FlexResizer>
            <Controls />
        </AppWrapper>
    </Provider>,
    appContainer
);
