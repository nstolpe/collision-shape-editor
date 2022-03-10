import React from 'react';
import { render } from 'react-dom';
import * as PIXI from 'pixi.js';
import { Global } from '@emotion/react';

import FiraMonoRegular from 'fonts/FiraMono/FiraMono-Regular.ttf';
import AppWrapper from 'components/html/AppWrapper';
import ContextMenu from 'components/html/ContextMenu';
import Controls from 'components/html/Controls';
import FlexResizer from 'components/html/FlexResizer';
import Screen from 'components/pixi/Screen';
import RootStore from 'store/RootStore';

const appContainer = document.getElementById('root');

// workaround for pixi to work with dev tools
window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
// end workaround

render(
  <RootStore>
    <Global
      styles={{
        html: {
          fontSize: '10px',
          lineHeight: 1.5,
        },
        '@font-face': {
          fontFamily: 'Fira Mono',
          src: `local('Fira Mono'),
            url(${FiraMonoRegular}) format('truetype')`,
          fontWeight: 400,
          fontStyle: 'normal',
        }
      }}
    />
    <AppWrapper>
      <FlexResizer>
        <Screen />
      </FlexResizer>
      <Controls />
      <ContextMenu />
    </AppWrapper>
  </RootStore>,
  appContainer
);
