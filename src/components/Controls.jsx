// src/js/components/Controls.js
import React from 'react';
import styled from '@emotion/styled';
import chroma from 'chroma-js';

import {
  addTextureSource,
  setBackgroundColor,
} from 'actions/actions';
import ColorPicker from 'components/ColorPicker';
import FileLoader from 'components/html/FileLoader';
import EdgeIcon from 'components/html/EdgeIcon';
import VertexIcon from 'components/html/VertexIcon';
import { useRootContext } from 'contexts/RootContext';

const ControlWrapper = styled.div`
  background-color: hsl(0, 0%, 75%);
  padding: 1em;
  & > * {
    margin-right: 1rem !important;
  }
`;

ControlWrapper.displayName = 'ControlWrapper';

const Controls = ({ children }) => {
  const { backgroundColor, dispatch } = useRootContext();

  const onColorChange =({ r, g, b }) => {
    const color = chroma(r, g, b);
    dispatch(setBackgroundColor(parseInt(color.hex().replace('#', ''), 16)));
  };

  const onLoad = (name, data) => {
    dispatch(addTextureSource(name, data));
  };

  return(
    <ControlWrapper>
      <FileLoader onLoad={onLoad} accept="image/*" multiple />
      <ColorPicker
        initialColor={backgroundColor}
        onColorChange={onColorChange}
        title="background color"
        titleFontFamily="Fira Mono"
        valueFontFamily="Fira Mono"
      />
      <VertexIcon />
      <EdgeIcon />
      {children}
    </ControlWrapper>
  );
};

export default Controls;
