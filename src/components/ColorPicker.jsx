// src/js/components/ColorPicker.js
// reference: https://codepen.io/amwill/pen/ZbdGeW
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';

const Trigger = styled.a.attrs(({ triggerWidth, triggerHeight, backgroundColor }) => ({
  width: triggerWidth == null ? '5.4em' : triggerWidth,
  height: triggerHeight == null ? '5.4em' : triggerHeight,
  backgroundColor: backgroundColor,
}))`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: ${({ backgroundColor }) => backgroundColor};
  text-decoration: none;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  transition: opacity 0.2s ease;
  border-radius: .2em;
  vertical-align: middle;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 2px #ffffff;
  }
`;

const Panel = styled.div`
  position: absolute;
  display: ${({active}) => active ? 'flex' : 'none'};
  bottom: 100%;
  background-color: #d9d9d9;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: .2em .2em 0 0;
  cursor: default;
`;


const ValuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

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
  touch-action: none;
`;

const SlideCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: ${({ dragging }) => dragging ? 'none' : cursor};
  margin: ${({ width }) => `0 ${width * .25}px`};
  touch-action: none;
`;

const Label = styled.label`
  font-family: sans-serif;
  font-size: 1.4em;
  font-weight: bold;
  user-select: none;
`;

const Input = styled.input`
`;

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
      const hue = event.nativeEvent.offsetY;
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
      const hue = event.nativeEvent.offsetY;
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

        const interval = height / 360;

        for (let row = 0; row < height; row += interval) {
          const color = chroma({ h: Math.ceil(row), s: 1, l: 0.5 });
          ctx.fillStyle = color.hex();

          // if this is the active row indicate it.
          if (activeHue >= row && activeHue < (row + interval)) {
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

const ColorPicker = ({ initialColor, padWidth, padHeight, slideWidth, slideHeight, onColorChange }) => {
  // color is a number, make it a chroma instance
  const [activeColor, setActiveColor] = useState(chroma(initialColor));
  const color = chroma(initialColor);
  const [activeHue, setActiveHue] = useState(~~color.get('hsv.h'));
  const [activeSaturation, setActiveSaturation] = useState(color.get('hsv.s'));
  const [activeValue, setActiveValue] = useState(color.get('hsv.v'));
  const [active, setActive] = useState(false);

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
    const close = ({ code, target }) => {
      if (trigger !== target || code === 'Escape') {
        setActive(false);
      }
    };

    if (trigger) {
      if (active) {
        document.addEventListener('keydown', close, false);
        document.addEventListener('pointerdown', close, false);
      } else {
        document.removeEventListener('keydown', close, false);
        document.removeEventListener('pointerdown', close, false);
      }
    }

    return () => {
      document.removeEventListener('keydown', close, false);
      document.removeEventListener('pointerdown', close, false);
    };
  }, [active]);

  return (
    <Trigger backgroundColor={activeColor} onClick={toggleActive} ref={triggerRef}>
      <Panel
        active={active}
        onClick={event => event.stopPropagation()}
        onPointerDown={event => event.stopPropagation()}
      >
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
          <Label>
            RGB:<Input type="text" value={`${activeColor.get('rgb.r')}/${activeColor.get('rgb.g')}/${activeColor.get('rgb.b')}`} readOnly />
          </Label>
          <Label>
            HSV:<Input type="text" value={`${activeHue}/${activeSaturation.toFixed(3)}/${activeValue.toFixed(3)}`} readOnly />
          </Label>
          <Label>
            Hex:<Input type="text" value={activeColor.hex()} readOnly />
          </Label>
        </ValuesWrapper>
      </Panel>
    </Trigger>
  );
};

ColorPicker.defaultProps = {
  color: 0xff0000,
  padWidth: 360,
  padHeight: 360,
  slideWidth: 48,
  slideHeight: 360,
  onColorChange: ({ r, g, b }) => ({ r, g, b }),
};

ColorPicker.propTypes = {
  color: PropTypes.number,
  padWidth: PropTypes.number,
  padHeight: PropTypes.number,
  slideWidth: PropTypes.number,
  slideHeight: PropTypes.number,
  onColorChange: PropTypes.func,
};

export default ColorPicker;
