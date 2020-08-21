// src/components/html/color-picker/components/SaturationValueCanvas
import React, {
  useCallback,
  useState,
} from 'react';
import styled from '@emotion/styled/macro';
import chroma from 'chroma-js';

import { canvasCrosshair } from 'components/html/color-picker/constants/cursors';
import {
  setActiveColor,
  useStoreContext,
} from 'components/html/color-picker/store/Store';

const PadCanvas = styled.canvas`
  display: inline-block;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  vertical-align: middle;
  cursor: ${({ isDragging }) => isDragging ? 'none' : canvasCrosshair};
  pointer-events: auto;
  touch-action: none;
`;

PadCanvas.displayName = 'PadCanvas';

const SaturationValueCanvas = ({
  height,
  width,
  onColorChange,
}) => {
  const {
    activeColor,
    dispatch,
  } = useStoreContext();
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Updates the color in state and calls the color change callback.

   */
  const handleUpdateColorFromCoordinates = ({ x, y }) => {
    const h = activeColor.get('hsv.h') || 0;
    const s = x / width;
    const v = 1 - (y / height);

    const color = chroma({ h, s, v });

    dispatch(setActiveColor(color));
    onColorChange({ r: color.get('rgb.r'), g: color.get('rgb.g'), b: color.get('rgb.b') });
  };

  const handlePointerDown = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }

  const handlePointerMove = event => {
    event.preventDefault();
    event.stopPropagation();

    if (isDragging) {
      const { nativeEvent: { offsetX: x, offsetY: y } } = event;
      handleUpdateColorFromCoordinates({ x, y });
    }
  };

  const handlePointerUp = event => {
    event.preventDefault();
    event.stopPropagation();

    if (isDragging) {
      const { nativeEvent: { offsetX: x, offsetY: y } } = event;
      handleUpdateColorFromCoordinates({ x, y });
      setIsDragging(false);
    }
  };

  const handlePointerLeave = event => setIsDragging(false);

  const canvas = useCallback(cnvs => {
    if (cnvs && width > 0 && height > 0) {
      const ctx = cnvs.getContext('2d');
      const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
      const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
      const h = activeColor.get('hsv.h') || 0;
      const s = activeColor.get('hsv.s');
      const v = activeColor.get('hsv.v');

      // only need the hue for the background hex.
      const color = chroma({ h: h, s: 1, v: 1 });
      const hex = color.hex();
      // get x from saturation and y from value.
      const x = s * width;
      const y = v * height;

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

      // ensure the first pixel is white, the gradient might have overwritten it.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1, 1);

      // ensure the pixel at `width - 1`, `0` is the activeColor hue, the gradient
      // might have overwriten it.
      ctx.fillStyle = hex;
      ctx.fillRect(width - 1, 0, 1, 1);

      /**
       * draw the cursor
       */
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
  }, [activeColor, height, width]);

  return (
    <PadCanvas ref={canvas} width={width} height={height}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      isDragging={isDragging}
    />
  );
};

export default SaturationValueCanvas;
