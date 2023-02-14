import { EDGE, VERTEX, VIEWPORT } from 'Constants/prefixes';
import edgeMainPointerEventsReducer from 'Reducers/edge-main-pointer-events';
import vertexMainPointerEventsReducer from 'Reducers/vertex-main-pointer-events';
import viewportMainPointerEventsReducer from 'Reducers/viewport-main-pointer-events';
import { POINTER_DOWN } from 'Constants/pointer-events';

/**
 * Reducer that handles a MAIN (left mouse button) pointer down. Passes control on to a target
 * specific reducer.
 */
const reducer = (state, { data, type }) => {
  switch (type) {
    case EDGE:
      return edgeMainPointerEventsReducer(state, { data, type: POINTER_DOWN });
    case VERTEX:
      return vertexMainPointerEventsReducer(state, {
        data,
        type: POINTER_DOWN,
      });
    case VIEWPORT:
      return viewportMainPointerEventsReducer(state, {
        data,
        type: POINTER_DOWN,
      });
    default:
      return state;
  }
};

export default reducer;
