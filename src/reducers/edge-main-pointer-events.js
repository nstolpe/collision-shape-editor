import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
} from 'Constants/pointer-events';
import pointerDownMainEdgeToolReducer from 'Reducers/pointer-down-main-edge-tool-reducer';

const reducer = (state, { data, type }) => {
  switch (type) {
    case POINTER_DOWN:
      return pointerDownMainEdgeToolReducer(state, { data, type: state.tool });
    case POINTER_MOVE:
      return state;
    case POINTER_UP:
      return state;
    default:
      return state;
  }
};

export default reducer;
