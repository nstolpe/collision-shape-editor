// src/js/components/Controls.js
import React from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';

import {
  addTextureSource,
  setBackgroundColor,
} from 'actions/actions';
import ColorPicker from 'components/ColorPicker';
import FileLoader from 'components/FileLoader';
import { useRootContext } from 'contexts/RootContext';

const Styled = styled.div`
  background-color: #ebebeb;
  padding: 1em;
  & > * {
    margin-right: 1em;
  }
`;

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
    <Styled>
      <FileLoader onLoad={onLoad} accept="image/*" multiple />
      <ColorPicker initialColor={backgroundColor} onColorChange={onColorChange} />
      {children}
    </Styled>
  );
};

export default Controls;
