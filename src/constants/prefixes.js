// src/constants/type-prefixes.js

export const VIEWPORT = 'VIEWPORT';
export const VERTEX = 'VERTEX';
export const EDGE = 'EDGE';
export const SHAPE = 'SHAPE';
export const SPRITE = 'SPRITE';

const prefixes = Object.assign(Object.create(null), {
  EDGE,
  VERTEX,
});

export const prefix = (key, value, delimiter = '::') =>
  `${prefixes[key]}${delimiter}${value}`;

export const PFXR = (prefix, delimiter = '::') => {
  return {
    prefix,
    add: (value) => `${prefix}${delimiter}${value}`,
    remove: (value) => String(value).replace(new RegExp(`^${value}`), ''),
  };
};
