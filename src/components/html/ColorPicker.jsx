// src/js/components/ColorPicker.js
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid'
import chroma from 'chroma-js';
import Draggable from 'react-draggable';

import { Button } from 'components/html/resets';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: middle;
`;

const Trigger = styled(
  Button,
  {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'height' && prop !== 'width'
  }
)(
  ({
    active,
    backgroundColor,
    height,
    width,
  }) => ({
    backgroundColor,
    height,
    width,
    boxShadow: active ? '0 0 10px rgba(0,0,0,0.5) inset' : 'none',
    borderRadius: '4px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'block',
    position: 'relative',
    textDecoration: 'none',
    transition: 'box-shadow 0.15s ease-in-out',
    verticalAlign: 'middle',
  })
);

Trigger.propTypes ={
  active: PropTypes.bool,
  backgroundColor: PropTypes.string,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  width:  PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

Trigger.defaultProps = {
  active: false,
  backgroundColor: '#ffffff',
  height: '5.6em',
  width: '5.6em',
};

const Panel = styled.div`
  bottom: 100%;
  cursor: move;
  font-size: 16px;
  left: 0;
  line-height: 1.5;
  position: absolute;
  opacity: ${({ active }) => active ? 1 : 0};
  pointer-events: ${({ active }) => active ? 'auto' : 'none'};
  z-index: ${({ active }) => active ? 1000 : -1000};
  background-color: hsl(0, 0%, 75%);
  margin: 0 !important;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 4px;
  box-shadow: 0 0 4px 0px rgba(0,0,0,0.6);
  transition: opacity 0.15s ease-in-out;
  ${({ active }) => !active ? '& * { visibility: hidden }' : ''}
`;

Panel.displayName = 'Panel';

const PanelHeader = styled.h3`
  background-color: hsl(0,0%,25%);
  border-radius: 4px;
  color: hsl(0,0%,75%);
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: 1.25em;
  line-height: 1.2;
  margin: 0 0 0.8em;
  pointer-events: none;
  text-align: center;
  user-select: none;
`;

PanelHeader.displayName = 'PanelHeader';

const ContentWrapper = styled.div`
  display: flex;
  pointer-events: none;
`;

ContentWrapper.displayName = 'ContentWrapper';

const cursor = `url("data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' height='19' width='19' viewBox='0 0 19 19'>
      <line x1='0' y1='9' x2='19' y2='9' stroke='%23ffffff' stroke-width='1' />
      <line x1='9' y1='0' x2='9' y2='19' stroke='%23ffffff' stroke-width='1' />
  </svg>"
) 9 9, crosshair`;

const PadCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: ${({ dragging }) => dragging ? 'none' : cursor};
  pointer-events: auto;
  touch-action: none;
`;

PadCanvas.displayName = 'PadCanvas';

const SlideCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: ${({ dragging }) => dragging ? 'none' : cursor};
  margin: ${({ width }) => `0 ${width * .25}px`};
  pointer-events: auto;
  touch-action: none;
`;

SlideCanvas.displayName = 'SlideCanvas';

const ValuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1em;
  justify-content: flex-start;
  line-height: 1.5;
  pointer-events: none;
`;

ValuesWrapper.displayName = 'ValuesWrapper';

const ValueLabel = styled.label`
  display: flex;
  font-family: sans-serif;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 1em;
  user-select: none;
`;

ValueLabel.displayName = 'ValueLabel';

const ValueSpan = styled.span`
  color: hsl(0,0%,25%);
  font-family: ${({ fontFamily }) => fontFamily};
  margin-right: 0.5em;
`;

ValueSpan.displayName = 'ValueSpan';

const Input = styled.input`
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 4px hsl(0,0%,25%) inset;
  box-sizing: border-box;
  cursor: text;
  font-size: 1em;
  line-height: 1.5;
  padding: 0 0.5em;
  width: 8em;
`;

Input.displayName = 'Input';

const SaturationValueCanvas = ({
  activeHue,
  activeSaturation,
  activeValue,
  height,
  width,
  onColorChange,
  setActiveColor,
  setActiveSaturation,
  setActiveValue,
}) => {
  const [dragging, setDragging] = useState(false);
  const handlePointerDown = event => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  }

  const handlePointerMove = event => {
    event.preventDefault();
    event.stopPropagation();

    if (dragging) {
      const { nativeEvent: { offsetX: x, offsetY: y } } = event;
      const saturation = x / width;
      const value = 1 - (y / height);
      const color = chroma({ h: activeHue, s: saturation, v: value });
      setActiveSaturation(saturation);
      setActiveValue(value);
      setActiveColor(color);
      onColorChange({ r: color.get('rgb.r'), g: color.get('rgb.g'), b: color.get('rgb.b') });
    }
  };

  const handlePointerUp = event => {
    event.preventDefault();
    event.stopPropagation();

    if (dragging) {
      const { nativeEvent: { offsetX: x, offsetY: y } } = event;
      const saturation = x / width;
      const value = 1 - (y / height);
      const color = chroma({ h: activeHue, s: saturation, v: value });
      setActiveSaturation(saturation);
      setActiveValue(value);
      setActiveColor(color);
      onColorChange({ r: color.get('rgb.r'), g: color.get('rgb.g'), b: color.get('rgb.b') });
      setDragging(false);
    }
  };

  const handlePointerLeave = event => setDragging(false);

  const canvas = useCallback(cnvs => {
    if (cnvs && width > 0 && height > 0) {
      const ctx = cnvs.getContext('2d');
      const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
      const valueGradient = ctx.createLinearGradient(0, 0, 0, height);

      // only need the hue for the background.
      const color = chroma({ h: activeHue, s: 1, v: 1 });
      const hex = color.hex();
      const x = activeSaturation * width;
      const y = activeValue * height;

      ctx.clearRect(0, 0, width, height);

      // saturation gradient: white-to-transparent, left-to-right
      saturationGradient.addColorStop(0, 'rgba(255,255,255,1)');
      saturationGradient.addColorStop(1, 'rgba(255,255,255,0)');
      // value gradient: black-to-transparent, bottom-to-top
      valueGradient.addColorStop(0, 'rgba(0,0,0,0)');
      valueGradient.addColorStop(1, 'rgba(0,0,0,1)');

      // draw the active color's hue
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, width, height);

      // draw the saturation gradient
      ctx.fillStyle = saturationGradient;
      ctx.fillRect(0, 0, width, height);

      // draw the svalue gradient
      ctx.fillStyle = valueGradient;
      ctx.fillRect(0, 1, width, height);

      // ensure the first pixel is white, the gradient might overwrite it.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1, 1);

      // ensure the pixel at `width - 1`, `0` is the activeColor hue, the gradient might overwrite it.
      ctx.fillStyle = hex;
      ctx.fillRect(width - 1, 0, 1, 1);

      // draw the cursor
      // get first and last pixels on row and column
      const rowFirst = ctx.getImageData(0, height - y, 1, 1).data;
      const rowLast = ctx.getImageData(width - 1, height - y, 1, 1).data;

      const colFirst = ctx.getImageData(x, 0, 1, 1).data;
      const colLast = ctx.getImageData(x, height - 1, 1, 1).data;

      // create gradients
      const rowGradient = ctx.createLinearGradient(0, height - y, width, 1);
      const colGradient = ctx.createLinearGradient(x, 0, 1, height);

      // create inverse gradients from first and last row and column pixel values
      rowGradient.addColorStop(0, `rgba(${255 - rowFirst[0]},${255 - rowFirst[1]},${255 - rowFirst[2]},1)`);
      rowGradient.addColorStop(1, `rgba(${255 - rowLast[0]},${255 - rowLast[1]},${255 - rowLast[2]},1)`);
      colGradient.addColorStop(0, `rgba(${255 - colFirst[0]},${255 - colFirst[1]},${255 - colFirst[2]},1)`);
      colGradient.addColorStop(1, `rgba(${255 - colLast[0]},${255 - colLast[1]},${255 - colLast[2]},1)`);

      // draw the gradients
      ctx.fillStyle = rowGradient;
      ctx.fillRect(0, height - y, width, 1);

      ctx.fillStyle = colGradient;
      ctx.fillRect(x, 0, 1, height);
    }
  }, [activeHue, activeSaturation, activeValue, height, width]);

  return (
    <PadCanvas ref={canvas} width={width} height={height}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      dragging={dragging}
    />
  );
};

const HueCanvas = ({ activeHue, activeSaturation, activeValue, setActiveColor, setActiveHue, height, width, onColorChange }) => {
  const [dragging, setDragging] = useState(false);
  const ratio = height / 360;

  const handlePointerDown = event => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handlePointerLeave = event => setDragging(false);

  const handlePointerMove = event => {
    event.preventDefault();
    event.stopPropagation();

    if (dragging) {
      const hue = event.nativeEvent.offsetY / ratio;
      const color = chroma({ h: hue, s: activeSaturation, v: activeValue });
      setActiveHue(hue);
      setActiveColor(color);
      onColorChange({ r: color.get('rgb.r'), g: color.get('rgb.g'), b: color.get('rgb.b') });
    }
  };

  const handlePointerUp = event => {
    event.preventDefault();
    event.stopPropagation();

    if (dragging) {
      const hue = event.nativeEvent.offsetY / ratio;
      const color = chroma({ h: hue, s: activeSaturation, v: activeValue });
      setActiveHue(hue);
      setActiveColor(color);
      onColorChange({ r: color.get('rgb.r'), g: color.get('rgb.g'), b: color.get('rgb.b') });
      setDragging(false);
    }
  };

  const canvas = useCallback(cnvs => {
    if (cnvs) {
      const ctx = cnvs.getContext('2d');

      if (width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < height; row++) {
          const ratioRow = row / ratio;
          const color = chroma({ h: ratioRow, s: 1, l: 0.5 });
          ctx.fillStyle = color.hex();

          // if this is the active row indicate it.
          if (activeHue >= ratioRow && activeHue < ratioRow + (1 / ratio)) {
            const inverse = chroma(0xffffff - parseInt(color.hex().replace('#', ''), 16));
            ctx.fillStyle = inverse.hex();
          }

          ctx.fillRect(0, Math.ceil(row), width, Math.ceil(row));
        }
      }
    }
  }, [activeHue, height, width]);

  return (
    <SlideCanvas ref={canvas} width={width} height={height}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      dragging={dragging}
    />
  );
};

const ColorPicker = ({
  initialColor,
  padWidth,
  padHeight,
  slideWidth,
  slideHeight,
  title,
  titleFontFamily,
  onColorChange,
}) => {
  // color is a number, make it a chroma instance
  const [activeColor, setActiveColor] = useState(chroma(initialColor));
  const color = chroma(initialColor);
  const [activeHue, setActiveHue] = useState(~~color.get('hsv.h'));
  const [activeSaturation, setActiveSaturation] = useState(color.get('hsv.s'));
  const [activeValue, setActiveValue] = useState(color.get('hsv.v'));
  const [active, setActive] = useState(false);
  const [panelDragging, setPanelDragging] = useState(false);
  /**
   * Toggles active/inactive for the colorpicker.
   */
  const toggleActive = e => {
    e.stopPropagation();
    setActive(active => !active);
  };

  const triggerRef = useCallback(trigger => {
    /**
     * close the picker when anything outside of the trigger receives a pointerdown
     * or when escape is pressed
     * @TODO confirm this is the best way to handle escape
     */
    const close = e => {
      const { type, target, key, keyCode } = e;
      const panel = trigger.nextElementSibling;
      let doClose = false;

      switch (type) {
        case 'keydown':
          if (active && (key === 'Escape' || key === 'Esc' || keyCode === 27)) {
            doClose = true;
          }
          break;
        case 'pointerdown':
          if (active && target !== trigger && !panel.contains(target)) {
            doClose = true;
          }
          break;
        default:
          break;
      }

      if (doClose) {
        setActive(false);
        document.removeEventListener('keydown', close);
        document.removeEventListener('pointerdown', close);
      }
    };

    if (trigger && active) {
      document.addEventListener('keydown', close);
      document.addEventListener('pointerdown', close);
    }

    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    };
  }, [active]);


  return (
    <Wrapper>
      <Trigger
        active={active}
        backgroundColor={activeColor.hex()}
        onClick={toggleActive}
        ref={triggerRef}
        displayName="Trigger"
        title={title}
      />
      <Draggable
        enableUserSelectHack={false}
        onStop={e => setPanelDragging(false)}
        onStart={e => setPanelDragging(true)}
      >
        <Panel
          active={active}
        >
          <PanelHeader fontFamily={titleFontFamily}>{title}</PanelHeader>
          <ContentWrapper>
            <SaturationValueCanvas
              width={padWidth}
              height={padHeight}
              activeHue={activeHue}
              activeSaturation={activeSaturation}
              activeValue={activeValue}
              setActiveColor={setActiveColor}
              setActiveSaturation={setActiveSaturation}
              setActiveValue={setActiveValue}
              onColorChange={onColorChange}
            />
            <HueCanvas
              width={slideWidth}
              height={slideHeight}
              activeHue={activeHue}
              activeSaturation={activeSaturation}
              activeValue={activeValue}
              setActiveColor={setActiveColor}
              setActiveHue={setActiveHue}
              onColorChange={onColorChange}
            />
            <ValuesWrapper>
              <ValueLabel>
                <ValueSpan>rgb:</ValueSpan>
                <Input type="text" value={`${activeColor.get('rgb.r')}/${activeColor.get('rgb.g')}/${activeColor.get('rgb.b')}`} disabled={active && !panelDragging ? false : true}/>
              </ValueLabel>
              <ValueLabel>
                <ValueSpan>hsv:</ValueSpan>
                <Input type="text" value={`${activeHue}/${activeSaturation.toFixed(3)}/${activeValue.toFixed(3)}`} readOnly  disabled={active && !panelDragging ? false : true} />
              </ValueLabel>
              <ValueLabel>
                <ValueSpan>hex:</ValueSpan>
                <Input type="text" value={activeColor.hex().replace('#', '')} readOnly  disabled={active && !panelDragging ? false : true} />
              </ValueLabel>
            </ValuesWrapper>
          </ContentWrapper>
        </Panel>
      </Draggable>
    </Wrapper>
  );
};

ColorPicker.defaultProps = {
  color: 0xff0000,
  padWidth: 256,
  padHeight: 256,
  slideWidth: 48,
  slideHeight: 256,
  title: 'Color Picker',
  titleFontFamily: 'sans-serif',
  valueFontFamily: 'sans-serif',
  onColorChange: ({ r, g, b }) => ({ r, g, b }),
};

ColorPicker.propTypes = {
  color: PropTypes.number,
  padWidth: PropTypes.number,
  padHeight: PropTypes.number,
  slideWidth: PropTypes.number,
  slideHeight: PropTypes.number,
  title: PropTypes.string,
  titleFontFamily: PropTypes.string,
  valueFontFamily: PropTypes.string,
  onColorChange: PropTypes.func,
};

export default ColorPicker;
