// src/tools/prefix.js
import { escapeRegExp } from 'tools/reg-exp';

export const addPrefix = (string, prefix, delimiter = '__') => `${prefix}${delimiter}${string}`;

export const hasPrefix = (string, prefix, delimiter = '__') => {
  const escaped = escapeRegExp(`${prefix}${delimiter}`);
  return `${string}`.indexOf(escaped) === 0;
};

export const removePrefix = (string, prefix, delimiter = '__') => {
  const escaped = escapeRegExp(`${prefix}${delimiter}`);
  return `${string}`.replace(new RegExp(`^${escaped}`), '');
};
