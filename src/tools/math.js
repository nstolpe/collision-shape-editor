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

const point0 = { x: 0, y: 0 };

/**
 * Expands a rectangle defined by minX, maxX, minY, and maxY to include
 * the point at [x, y] if that point is not already inside the rectangle.
 *
 * @return [minX, maxX, minY, maxY]
 */
export const expandAABB = (
  x,
  y,
  minX,
  maxX,
  minY,
  maxY,
) => {
  return [
    // minX:
    x < minX ? x : minX,
    // maxX:
    x > maxX ? x : maxX,
    // minY:
    y < minY ? y : minY,
    // maxY:
    y > maxY ? y : maxY,
  ];
};

/**
 * Checks if `point` is inside of an axis aligned bounding box defined by the points
 * `boundA` and `boundB`. Add offset if you want to check an area and not just a point.
 */
export const withinAABB = (point=point0, boundA=point0, boundB=point0, offset=0) => {
  if (
    (point.x + offset >= boundA.x && point.x - offset <= boundB.x) ||
    (point.x - offset <= boundA.x && point.x + offset >= boundB.x)
  ) {
    if (
      (point.y + offset >= boundA.y && point.y - offset <= boundB.y) ||
      (point.y - offset <= boundA.y && point.y + offset >= boundB.y)
    ) {
      return true;
    }
  }

  return false;
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

/**
 * Takes 3 points. The first two define a line segment. The third
 * is a point not on the segment. Returns an array [x, y] of the
 * closest point.
 */
export const closestPointOnSegment = (s1, s2, point) => {
  const s1x = s1?.x ?? s1?.[0];
  const s1y = s1?.y ?? s1?.[1];
  const s2x = s2?.x ?? s2?.[0];
  const s2y = s2?.y ?? s2?.[1];

  if (![s1x, s1y, s2x, s2y].every(n => !Number.isNaN(parseFloat(n)))) {
    // throw error or return null or something
  }

  const dX = s2x - s1x;
  const dY = s2y - s1y;

  if (dX === 0 && dY === 0) {
    return [dX, dY];
  }

  const u = (
    (((point.x - s1x) * dX) + ((point.y - s1y) * dY)) /
    (((dX * dX) + (dY * dY)))
  );

  let closestPoint;

  switch (true) {
    case u < 0:
      return [s1x, s1y];
      break;
    case u > 1:
      return [s2x, s2y];
      break;
    default:
      return [
        s1x + (u * dX),
        s1y + (u * dY),
      ];
  }
};
