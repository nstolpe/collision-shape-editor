// src/comparators/scale.js
const comparator = (
  { x, y },
  { x: oldX, y: oldY }
) => {
  if (x !== oldX || y !== oldY) {
    return false;
  }

  return true;
};

export default comparator;
