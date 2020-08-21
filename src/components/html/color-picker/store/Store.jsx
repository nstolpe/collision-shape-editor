// components/html/color-picker/store/Store.js
import React, {
  createContext,
  useReducer,
  useContext,
} from 'react';
import chroma from 'chroma-js';

/**
 * Wraps chroma in try/catch.
 * @TODO Should go to a utility
 * @param {any} source  The source for the color. Anything (string, number, chroma instance, etc) that
 *                      is valid to pass to `chroma` will return the color it evaluates to. Anything
 *                      that will error returns an instance of chroma set to black/0x000000
 * @return {object}  A chroma instance.
 */
const color = source => {
  let c;
  try {
    c = chroma(source);
  } catch (e) {
    c = chroma(0x000000);
  }
  return c;
};

const initialState = {
  activeColor: color(0xffffff),
  isActive: false,
  isModalDragging: false,
  modalElement: null,
  triggerElement: null,
};

export const StoreContext = createContext();
export const useStoreContext = () => useContext(StoreContext);

const SET_ACTIVE_COLOR = 'SET_ACTIVE_COLOR';
const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
const SET_IS_MODAL_DRAGGING = 'SET_IS_MODAL_DRAGGING';
const SET_MODAL_ELEMENT = 'SET_MODAL_ELEMENT';
const SET_TRIGGER_ELEMENT = 'SET_TRIGGER_ELEMENT';

export const setActiveColor = activeColor => ({
  type: SET_ACTIVE_COLOR,
  data: { activeColor: color(activeColor) },
});

export const setIsActive = isActive => ({
  type: SET_IS_ACTIVE,
  data: { isActive },
});

export const setIsModalDragging = isModalDragging => ({
  type: SET_IS_MODAL_DRAGGING,
  data: { isModalDragging },
});

export const setModalElement = modalElement => ({
  type: SET_MODAL_ELEMENT,
  data: { modalElement },
});

export const setTriggerElement = triggerElement => ({
  type: SET_TRIGGER_ELEMENT,
  data: { triggerElement },
});

const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_ACTIVE_COLOR:
      return {
        ...state,
        activeColor: data.activeColor,
      }
    case SET_IS_ACTIVE:
      return {
        ...state,
        isActive: data.isActive,
      }
    case SET_IS_MODAL_DRAGGING:
      return {
        ...state,
        isModalDragging: data.isModalDragging,
      };
    case SET_MODAL_ELEMENT:
      return {
        ...state,
        modalElement: data.modalElement,
      };
    case SET_TRIGGER_ELEMENT:
      return {
        ...state,
        triggerElement: data.triggerElement,
      };
    default:
      console.log(`undefined action: ${action.type}`, action);
      return state;
  }
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  window.state = state;
  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default Store;
