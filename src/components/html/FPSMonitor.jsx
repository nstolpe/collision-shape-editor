// src/components/html/FPSMonitor.jsx
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import withSelector from 'Components/hoc/withSelector';
import RootContext from 'Contexts/RootContext';

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: grey;
  height: 6.4rem;
  width: 6.4rem;
  background: darkturquoise;
  vertical-align: middle;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%) inset;
`;

const Text = styled.div`
  font-size: 1.6rem;
  font-family: 'Fira Mono';
`;

const selector = ({ pixiApp }) => ({ pixiApp });

const FPSMonitor = ({ pixiApp }) => {
  const [fps, setFps] = useState(0);
  window.pixiApp = pixiApp;
  useEffect(() => {
    const listener = function () {
      setFps(pixiApp.ticker.FPS);
    };

    if (pixiApp) {
      pixiApp.ticker.add(listener);
    }

    return () => pixiApp?.ticker.remove(listener);
  }, [pixiApp]);
  return (
    <Wrapper>
      <Text>FPS</Text>
      <Text>{fps.toPrecision(4)}</Text>
    </Wrapper>
  );
};

export default withSelector(RootContext, selector)(FPSMonitor);
