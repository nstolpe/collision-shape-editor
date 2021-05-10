// src/constants/type-prefixes.js

export const VERTEX = 'VERTEX';
export const EDGE = 'EDGE';
export const SPRITE = 'SPRITE';

const prefixes = Object.assign(Object.create(null), {
  EDGE,
  VERTEX,
});

export const prefix = (key, value, delimiter = '__') => `${prefixes[key]}${delimiter}${value}`;

export const PFXR = (prefix, delimiter = '__') => {
  return {
    prefix,
    add: value => `${prefix}${delimiter}${value}`,
    remove: value => String(value).replace(new RegExp(`^${value}`), ''),
  };
};
