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

export const timeout = (callback, delay) => {
  let start;
  let id;

  const step = timestamp => {
    if (start === undefined) {
      start = timestamp;
    }

    const elapsed = timestamp - start;

    if (elapsed < delay) {
      id = requestAnimationFrame(step);
    } else {
      callback();
    }
  }

  id = requestAnimationFrame(step);

  return () => cancelAnimationFrame(id);
};

export const interval = (callback, interval) => {
  let cancel;

  const wrappedCallback = () => {
    callback();
    cancel = timeout(wrappedCallback, interval);
  };

  cancel = timeout(wrappedCallback, interval);

  return () => cancel();
};
