// src/selectors/select-overlay.js
const selector = ({
  selectOverlay: {
    enabled,
    width,
    height,
    x,
    y,
  },
}) => ({
  enabled,
  width,
  height,
  x,
  y,
});

export default selector;
