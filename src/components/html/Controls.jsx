// src/js/components/html/Controls.js
import React from 'react';
import styled from '@emotion/styled';
import chroma from 'chroma-js';

import { setMode, setTool } from 'actions/actions';
import Modes from 'constants/modes';
import Tools from 'constants/tools';
import ModeTools from 'constants/mode-tools';
import {
  addTextureSource,
  setBackgroundColor,
} from 'actions/actions';
import ColorPicker from 'components/html/ColorPicker';
import FileLoader from 'components/html/FileLoader';
import EdgeIcon from 'components/html/EdgeIcon';
import PlusIcon from 'components/html/PlusIcon';
import MinusIcon from 'components/html/MinusIcon';
import SelectIcon from 'components/html/SelectIcon';
import SpriteIcon from 'components/html/SpriteIcon';
import VertexIcon from 'components/html/VertexIcon';
import Separator from 'components/html/Separator';
import { useRootContext } from 'contexts/RootContext';
import { property } from 'tools/utilities';

const ControlWrapper = styled.div`
  background-color: hsl(0, 0%, 75%);
  padding: 1em;
  & > * {
    margin-right: 1rem !important;
  }
`;

ControlWrapper.displayName = 'ControlWrapper';

const getIconProps = (dispatch, mode, tool) => {
  const addDisabled = !property(ModeTools, mode, []).includes(Tools.ADD);
  const deleteDisabled = !property(ModeTools, mode, []).includes(Tools.DELETE);
  const selectDisabled = !property(ModeTools, mode, []).includes(Tools.SELECT);

  return {
    edgeIconProps: {
        active: mode === Modes.EDGE,
        onClick: () => dispatch(setMode(mode === Modes.EDGE ? Modes.ALL : Modes.EDGE)),
        title: 'edge',
    },
    spriteIconProps: {
        active: mode === Modes.SPRITE,
        onClick: () => dispatch(setMode(mode === Modes.SPRITE ? Modes.ALL : Modes.SPRITE)),
        title: 'sprite',
    },
    vertexIconProps: {
        active: mode === Modes.VERTEX,
        onClick: () => dispatch(setMode(mode === Modes.VERTEX ? Modes.ALL : Modes.VERTEX)),
        title: 'vertex',
    },
    minusIconProps: {
      active: !deleteDisabled && tool === Tools.DELETE,
      disabled: deleteDisabled,
      onClick: () => dispatch(setTool(Tools.DELETE)),
      title: 'delete',
    },
    plusIconProps: {
      active: !addDisabled && tool === Tools.ADD,
      disabled: addDisabled,
      onClick: () => dispatch(setTool(Tools.ADD)),
      title: 'add',
    },
    selectIconProps: {
      active: !selectDisabled && tool === Tools.SELECT,
      disabled: selectDisabled,
      onClick: () => dispatch(setTool(Tools.SELECT)),
      title: 'select',
    },
  };
};

const Controls = ({ children }) => {
  const {
    backgroundColor,
    dispatch,
    mode,
    tool,
  } = useRootContext();

  const onColorChange =({ r, g, b }) => {
    const color = chroma(r, g, b);
    dispatch(setBackgroundColor(parseInt(color.hex().replace('#', ''), 16)));
  };

  const onLoad = (name, data) => {
    dispatch(addTextureSource(name, data));
  };

  const {
    edgeIconProps,
    minusIconProps,
    plusIconProps,
    selectIconProps,
    spriteIconProps,
    vertexIconProps,
  } = getIconProps(dispatch, mode, tool);

  return(
    <ControlWrapper>
      <FileLoader
        onLoad={onLoad}
        accept="image/*"
        multiple
        title="load sprites"
      />
      <ColorPicker
        title="background color"
        initialColor={backgroundColor}
        onColorChange={onColorChange}
        title="background color"
        titleFontFamily="Fira Mono"
        valueFontFamily="Fira Mono"
      />
      <Separator />
      <VertexIcon {...vertexIconProps} />
      <EdgeIcon {...edgeIconProps} />
      <SpriteIcon {...spriteIconProps} />
      <Separator />
      <SelectIcon {...selectIconProps} />
      <PlusIcon {...plusIconProps} />
      <MinusIcon {...minusIconProps} />
      {children}
    </ControlWrapper>
  );
};

export default Controls;
