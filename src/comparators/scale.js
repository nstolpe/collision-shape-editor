// src/comparators/scale.js
const comparator = (
  { scale: { x, y }, },
  { scale: { x: oldX, y: oldY } }
) => {
  if (x !== oldX || y !== oldY) {
    return false;
  }

  return true;
};

export default comparator;
