// src/reducers/modifier-keys-reducer.js
import {
  CLEAR_PRESSED_KEYS,
  PRESS_KEY,
  RELEASE_KEY,
  SET_ADD_KEY_PRESSED,
  SET_SUBTRACT_KEY_PRESSED,
  SET_PAN_KEY_PRESSED,
} from 'Constants/action-types';

export const initialState = {
  pressedKeyCodes: {},
  addModifierCode: 'Shift',
  subtractModifierCode: 'Control',
  panModifierCode: 'Space',
};

export const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case PRESS_KEY:
      return {
        ...state,
        pressedKeyCodes: { ...state.pressedKeyCodes, [data]: data },
      };
    case RELEASE_KEY:
      return {
        ...state,
        pressedKeyCodes: Object.keys(state.pressedKeyCodes).reduce(
          (newPressedKeyCodes, code) => {
            if (code !== data) {
              newPressedKeyCodes[code] = code;
              return newPressedKeyCodes;
            }
            return newPressedKeyCodes;
          },
          {}
        ),
      };
    case CLEAR_PRESSED_KEYS:
      return {
        ...state,
        pressedKeyCodes: {},
      };
    // case SET_ADD_KEY_PRESSED:
    //   return {
    //     ...state,
    //     addKeyPressed: data,
    //   };
    // case SET_SUBTRACT_KEY_PRESSED:
    //   return {
    //     ...state,
    //     subtractKeyPressed: data,
    //   };
    // case SET_PAN_KEY_PRESSED:
    //   return {
    //     ...state,
    //     panKeyPressed: data,
    //   };
    default:
      return state;
  }
};
