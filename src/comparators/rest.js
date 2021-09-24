// src/comparators/rest.js
const comparator = (props, oldProps) => {
  for (let key of Object.keys(props)) {
    if (props[key] !== oldProps[key]) {
      console.log(key, 'key')
      return false;
    }
  }
  return true;
};

export default comparator;