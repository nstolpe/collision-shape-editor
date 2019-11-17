import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";

// components
import AppWrapper from 'components/AppWrapper';
import Controls from 'components/Controls';
import FlexResizer from 'components/FlexResizer';
import Screen from 'components/Screen';
import Sprites from 'components/Sprites';
import Vertices from 'components/Vertices';
import ScreenContext from 'contexts/ScreenContext';

import store from 'store/store';

const appContainer = document.getElementById('root');

window.store = store;

render(
    <Provider store={store}>
        <AppWrapper>
            <FlexResizer>
                <Screen context={ScreenContext}>
                    <Sprites />
                    <Vertices />
                </Screen>
            </FlexResizer>
            <Controls />
        </AppWrapper>
    </Provider>,
    appContainer
);
