// src/tools/reg-exp.js
/**
 * Escapes special characters in a regex string so they can be matched in a regex.
 * Source:
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 */
export const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
