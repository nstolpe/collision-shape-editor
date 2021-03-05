// srs/constants/type-prefixes.js
export const VERTEX = 'VERTEX';
export const EDGE = 'EDGE';

const prefixes = Object.assign(Object.create(null), {
  EDGE,
  VERTEX,
});

const prefix = (key, value, delimiter='__') => `${prefixes[key]}${delimiter}${value}`;

export const PFXR = (prefix, delimiter = '__') => {
  return {
    prefix,
    add: value => `${prefix}${delimiter}${value}`,
    remove: value => String(value).replace(new RegExp(`^${value}`), ''),
  };
};

export default {
  VERTEX,
  EDGE,
  prefix,
};
