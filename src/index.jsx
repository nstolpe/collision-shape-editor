import React from 'react';
import { render } from 'react-dom';
import * as PIXI from 'pixi.js';

// components
import AppWrapper from 'components/AppWrapper';
import Controls from 'components/Controls';
import FlexResizer from 'components/FlexResizer';
import Screen from 'components/Screen';
import ScreenContext from 'contexts/ScreenContext';
import RootStore from 'store/RootStore';




const appContainer = document.getElementById('root');

// workaround for pixi to work with dev tools
PIXI.useDeprecated();

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
// end workaround

render(
  <RootStore>
    <AppWrapper>
      <FlexResizer>
        <Screen context={ScreenContext} />
      </FlexResizer>
      <Controls />
    </AppWrapper>
  </RootStore>,
  appContainer
);
