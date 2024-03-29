// src/tools/prefix.js
import { escapeRegExp } from 'Utility/reg-exp';

export const DEFAULT_DELIMITER = '::';

export const addPrefix = (prefix, string, delimiter = DEFAULT_DELIMITER) => `${prefix}${delimiter}${string}`;

export const hasPrefix = (string, prefix, delimiter = DEFAULT_DELIMITER) => {
  const escaped = escapeRegExp(`${prefix}${delimiter}`);
  return `${string}`.indexOf(escaped) === 0;
};

export const removePrefix = (prefix, string, delimiter = DEFAULT_DELIMITER) => {
  const escaped = escapeRegExp(`${prefix}${delimiter}`);
  return `${string}`.replace(new RegExp(`^${escaped}`), '');
};
