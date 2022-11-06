// src/js/actions/modifier-keys-actions.js
import {
  CLEAR_PRESSED_KEYS,
  PRESS_KEY,
  RELEASE_KEY,
  SET_ADD_KEY_PRESSED,
  SET_SUBTRACT_KEY_PRESSED,
  SET_PAN_KEY_PRESSED,
} from 'Constants/action-types';

export const clearKeys = () => ({
  type: CLEAR_PRESSED_KEYS,
});

export const pressKey = (key) => ({
  type: PRESS_KEY,
  data: key,
});

export const releaseKey = (key) => ({
  type: RELEASE_KEY,
  data: key,
});

export const setAddKeyPressed = (pressed) => ({
  type: SET_ADD_KEY_PRESSED,
  data: pressed,
});

export const setSubtractKeyPressed = (pressed) => ({
  type: SET_SUBTRACT_KEY_PRESSED,
  data: pressed,
});

export const setPanKeyPressed = (pressed) => ({
  type: SET_PAN_KEY_PRESSED,
  data: pressed,
});
