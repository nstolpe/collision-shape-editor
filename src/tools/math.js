/**
 * Returns the x,y translation between two points.
 * Points can be passed as an array [2,3] or object { x: 2, y: 3 }.
 */
export const translation = (a, b) => {
  const ax = a?.x ?? a?.[0] ?? 0;
  const ay = a?.y ?? a?.[1] ?? 0;
  const bx = b?.x ?? b?.[0] ?? 0;
  const by = b?.y ?? b?.[1] ?? 0;

  return {
    x: ax - bx,
    y: ay - by,
  };
};

/**
 * Returns the distance between two points.
 * Points can be passed as an array [2,3] or object { x: 2, y: 3 }.
 */
export const distance = (a, b) => {
  const { x, y } = translation(a, b);
  return Math.hypot(x, y);
};
