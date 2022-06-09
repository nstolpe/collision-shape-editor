// src/reducers/viewport-reducer.js
export const initialState = {
  viewportCenter: null,
};

const SET_VIEWPORT_CENTER = 'SET_VIEWPORT_CENTER';
const UNSET_VIEWPORT_CENTER = 'UNSET_VIEWPORT_CENTER';

export const setViewportCenter = viewport => ({
  type: SET_VIEWPORT_CENTER,
  data: viewport,
});

export const unsetViewportCenter = () => ({
  type: UNSET_VIEWPORT_CENTER,
});

export const reducer = (state, action) => {
  const { data, type } = action;

  switch (type) {
    case SET_VIEWPORT_CENTER: {
      const { x, y } = data;
      return {
        ...state,
        viewportCenter: { x, y },
      };
    }
    case UNSET_VIEWPORT_CENTER:
      return {
        ...state,
        viewportCenter: null,
      };
    default:
      return state;
  }
};
