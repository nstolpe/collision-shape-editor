// src/selectors/keys.js

export const allKeysSelector = ({ pressedKeyCodes }) => ({ ...pressedKeyCodes });
export const keySelector = code => state => allKeysSelector(state)[code];
