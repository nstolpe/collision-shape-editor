// src/components/html/color-picker/constants/cursors.js

// @TODO draw this on the canvas instead of using an svg.
export const canvasCrosshair = `url("data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' height='19' width='19' viewBox='0 0 19 19'>
      <line x1='0' y1='9' x2='19' y2='9' stroke='%23ffffff' stroke-width='1' />
      <line x1='9' y1='0' x2='9' y2='19' stroke='%23ffffff' stroke-width='1' />
  </svg>"
) 9 9, crosshair`;

export default {
  canvasCrosshair,
};
