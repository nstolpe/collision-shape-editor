import React from 'react';
import { render } from 'react-dom';
import * as PIXI from 'pixi.js';
import { Global } from '@emotion/react';

import FiraMonoRegular from 'Fonts/FiraMono/FiraMono-Regular.ttf';
import AppWrapper from 'Components/html/AppWrapper';
import ShapeContextMenu from 'Components/html/containers/ShapeContextMenu';
import Controls from 'Components/html/Controls';
import FlexResizer from 'Components/html/FlexResizer';
import Screen from 'Components/pixi/Screen';
import RootStore from 'Store/RootStore';

const appContainer = document.getElementById('root');
window.PIXI = PIXI;
// PIXI.WebGLRenderer = PIXI.Renderer;
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
        },
      }}
    />
    <AppWrapper>
      <FlexResizer>
        {({ height, width }) => <Screen width={width} height={height} />}
      </FlexResizer>
      <Controls />
      <ShapeContextMenu />
    </AppWrapper>
  </RootStore>,
  appContainer
);
