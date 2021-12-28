// src/comparators/rest.js
/**
 * Basic strict equality comparator. To get more granular control, use other comparators,
 * or a custom comparator. Returns true if no props have changed, false if any have.
 */
const comparator = (props, oldProps) => {
  for (let key of Object.keys(props)) {
    if (props[key] !== oldProps[key]) {
      return false;
    }
  }

  return true;
};

export default comparator;
