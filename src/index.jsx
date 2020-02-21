import React from 'react';
import { render } from 'react-dom';
import * as PIXI from 'pixi.js';
import { createGlobalStyle } from 'styled-components/macro';

import FiraMonoRegular from 'fonts/FiraMono/FiraMono-Regular.ttf';
import AppWrapper from 'components/AppWrapper';
import Controls from 'components/Controls';
import FlexResizer from 'components/html/FlexResizer';
import Screen from 'components/Screen';
import ScreenContext from 'contexts/ScreenContext';
import RootStore from 'store/RootStore';

const appContainer = document.getElementById('root');
const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Fira Mono';
    src: local('Fira Mono'),
      url(${FiraMonoRegular}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }
`;

// workaround for pixi to work with dev tools
PIXI.useDeprecated();

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
// end workaround

render(
  <RootStore>
    <Fonts />
    <AppWrapper>
      <FlexResizer>
        <Screen context={ScreenContext} />
      </FlexResizer>
      <Controls />
    </AppWrapper>
  </RootStore>,
  appContainer
);
