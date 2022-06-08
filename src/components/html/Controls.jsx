// src/components/html/Controls.js
import React from 'react';
import styled from '@emotion/styled';
import chroma from 'chroma-js';
import ColorPicker from 'color-picker';

import { setMode, setTool } from 'actions/actions';
import * as Modes from 'constants/modes';
import * as Tools from 'constants/tools';
import ModeTools from 'constants/mode-tools';
import { setBackgroundColor } from 'actions/actions';
import withSelector from 'components/hoc/withSelector';
import SpriteLoader from 'components/html/containers/SpriteLoader';
import EdgeIcon from 'components/html/EdgeIcon';
import PlusIcon from 'components/html/PlusIcon';
import MinusIcon from 'components/html/MinusIcon';
import SelectIcon from 'components/html/SelectIcon';
import SpriteIcon from 'components/html/SpriteIcon';
import VertexIcon from 'components/html/VertexIcon';
import PointerCoordinates from 'components/html/containers/PointerCoordinates';
import SelectCoordinates from 'components/html/containers/SelectCoordinates';
import FPSMonitor from 'components/html/FPSMonitor';
import Separator from 'components/html/Separator';
import RootContext from 'contexts/RootContext';
import { property } from 'tools/property';

const ControlWrapper = styled.div`
  background-color: hsl(0, 0%, 75%);
  padding: 1em;
  display: flex;
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
        title: 'mode: edge',
    },
    spriteIconProps: {
        active: mode === Modes.SPRITE,
        onClick: () => dispatch(setMode(mode === Modes.SPRITE ? Modes.ALL : Modes.SPRITE)),
        title: 'mode: sprite',
    },
    vertexIconProps: {
        active: mode === Modes.VERTEX,
        onClick: () => dispatch(setMode(mode === Modes.VERTEX ? Modes.ALL : Modes.VERTEX)),
        title: 'mode: vertex',
    },
    minusIconProps: {
      active: !deleteDisabled && tool === Tools.DELETE,
      disabled: deleteDisabled,
      onClick: () => dispatch(setTool(Tools.DELETE)),
      title: 'tool: delete',
    },
    plusIconProps: {
      active: !addDisabled && tool === Tools.ADD,
      disabled: addDisabled,
      onClick: () => dispatch(setTool(Tools.ADD)),
      title: 'tool: add',
    },
    selectIconProps: {
      active: !selectDisabled && tool === Tools.SELECT,
      disabled: selectDisabled,
      onClick: () => dispatch(setTool(Tools.SELECT)),
      title: 'tool: select',
    },
  };
};

const selector = ({
  backgroundColor,
  dispatch,
  mode,
  tool,
  rootContainer,
}) => ({
  backgroundColor,
  dispatch,
  mode,
  tool,
  rootContainer,
});

const Controls = ({
  backgroundColor,
  children,
  dispatch,
  mode,
  rootContainer,
  tool,
}) => {
  // @TODO make debug settable somewhere higher up in abb state.
  const debug = false;
  const onColorChange =({ r, g, b }) => {
    const color = chroma(r, g, b);
    dispatch(setBackgroundColor(parseInt(color.hex().replace('#', ''), 16)));
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
      <SpriteLoader
        accept="image/*"
        multiple
        title="load sprites"
      />
      <ColorPicker
        modalContainerElement={rootContainer}
        title="background color"
        initialColor={backgroundColor}
        onColorChange={onColorChange}
        titleFontFamily="Fira Mono"
        valueFontFamily="Fira Mono"
        triggerWidth={'64px'}
        triggerHeight={'64px'}
      />
      <Separator />
      <VertexIcon {...vertexIconProps} />
      <EdgeIcon {...edgeIconProps} />
      <SpriteIcon {...spriteIconProps} />
      <Separator />
      <SelectIcon {...selectIconProps} />
      <PlusIcon {...plusIconProps} />
      <MinusIcon {...minusIconProps} />
      <SelectCoordinates  styles={{ marginLeft: 'auto' }}/>
      <PointerCoordinates />
      {debug && <FPSMonitor />}
      {children}
    </ControlWrapper>
  );
};

export default withSelector(RootContext, selector)(Controls);
