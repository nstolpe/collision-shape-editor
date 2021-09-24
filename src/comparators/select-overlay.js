// src/comparators/select-overlay.js
const comparator = ({
  enabled,
  x,
  y,
  width,
  height
}, {
  enabled: oldEnabled,
  x: oldX,
  y: oldY,
  width: oldWidth,
  height: oldHeight
}) => {
  if (
    enabled !== oldEnabled ||
    width !== oldWidth ||
    height !== oldHeight ||
    x !== oldX ||
    y !== oldY
  ) {
    return false;
  }

  return true;
};

export default comparator;
