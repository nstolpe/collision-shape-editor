// src/components/html/Controls.js
import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import chroma from 'chroma-js';
import ColorPicker from 'color-picker';

import { setMode, setTool } from 'Actions/actions';
import * as Modes from 'Constants/modes';
import * as Tools from 'Constants/tools';
import ModeTools from 'Constants/mode-tools';
import { setBackgroundColor } from 'Actions/actions';
import withSelector from 'Components/hoc/withSelector';
import SpriteLoader from 'Components/html/containers/SpriteLoader';
import EdgeIcon from 'Components/html/EdgeIcon';
import PlusIcon from 'Components/html/PlusIcon';
import MinusIcon from 'Components/html/MinusIcon';
import SelectIcon from 'Components/html/SelectIcon';
import SpriteIcon from 'Components/html/SpriteIcon';
import VertexIcon from 'Components/html/VertexIcon';
import PointerCoordinates from 'Components/html/containers/PointerCoordinates';
import SelectCoordinates from 'Components/html/containers/SelectCoordinates';
import FPSMonitor from 'Components/html/FPSMonitor';
import Separator from 'Components/html/Separator';
import RootContext from 'Contexts/RootContext';
import { property } from 'Utility/property';

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
      onClick: () =>
        dispatch(setMode(mode === Modes.EDGE ? Modes.ALL : Modes.EDGE)),
      title: 'mode: edge',
    },
    spriteIconProps: {
      active: mode === Modes.SPRITE,
      onClick: () =>
        dispatch(setMode(mode === Modes.SPRITE ? Modes.ALL : Modes.SPRITE)),
      title: 'mode: sprite',
    },
    vertexIconProps: {
      active: mode === Modes.VERTEX,
      onClick: () =>
        dispatch(setMode(mode === Modes.VERTEX ? Modes.ALL : Modes.VERTEX)),
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
  const [lastClick, setLastClick] = useState(null);
  const [longPressTimeoutId, setLongPressTimeoutId] = useState(null);
  const debug = true;
  // don't ever change this so the ColorPicker isn't constantly initializing
  // might be better to create a container and do this there.
  const initialColor = useMemo(() => backgroundColor, []);
  const onColorChange = (color) =>
    dispatch(setBackgroundColor(parseInt(color.hex().replace('#', ''), 16)));

  const {
    edgeIconProps,
    minusIconProps,
    plusIconProps,
    selectIconProps,
    spriteIconProps,
    vertexIconProps,
  } = getIconProps(dispatch, mode, tool);

  return (
    <ControlWrapper>
      <SpriteLoader accept="image/*" multiple title="load sprites" />
      <ColorPicker
        modalContainerElement={rootContainer}
        portalTargetSelector="#AppWrapper"
        title="background color"
        initialColor={initialColor}
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
      <PlusIcon
        onPointerDown={(e) => {
          setLastClick(Date.now());
          const timeoutId = setTimeout(() => {
            console.log('long press', timeoutId);
            setLongPressTimeoutId(null);
          }, 500);
          setLongPressTimeoutId(timeoutId);
        }}
        onPointerUp={(e) => {
          if (longPressTimeoutId !== null) {
            clearTimeout(longPressTimeoutId);
            setLongPressTimeoutId(null);
          }
        }}
        {...plusIconProps}
      />
      <MinusIcon {...minusIconProps} />
      <SelectCoordinates styles={{ marginLeft: 'auto' }} />
      <PointerCoordinates />
      {debug && <FPSMonitor />}
      {children}
    </ControlWrapper>
  );
};

export default withSelector(RootContext, selector)(Controls);
