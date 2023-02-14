import { POINTER_MOVE } from 'Constants/pointer-events';
import { EDGE, SHAPE, VERTEX, VIEWPORT } from 'Constants/prefixes';
import viewportMainPointerEventsReducer from 'Reducers/viewport-main-pointer-events';
import { updateStateFromPointerMove } from 'Utility/state';

const reducer = (state, { data, type }) => {
  switch (type) {
    case SHAPE:
      return state;
    case EDGE:
    case VERTEX:
      return updateStateFromPointerMove(state, {
        data,
      });
    case VIEWPORT:
      return viewportMainPointerEventsReducer(state, {
        data,
        type: POINTER_MOVE,
      });
    default:
      return state;
  }
};

export default reducer;
