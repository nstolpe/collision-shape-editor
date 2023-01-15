import { EDGE, SHAPE, VERTEX, VIEWPORT } from 'Constants/prefixes';
import { hasPrefix } from 'Utility/prefix';

const targetTypeFromKey = (key) => {
  if (key === VIEWPORT) {
    return VIEWPORT;
  }

  if (hasPrefix(key, SHAPE)) {
    return SHAPE;
  }

  if (hasPrefix(key, VERTEX)) {
    return VERTEX;
  }

  if (hasPrefix(key, EDGE)) {
    return EDGE;
  }

  if (!window.ENV.production) {
    console.warn(`${key} doesn't match any criteria in getTargetTypeFromName`);
  }
};

export default targetTypeFromKey;
