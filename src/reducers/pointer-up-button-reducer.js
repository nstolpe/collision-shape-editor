import BUTTONS from 'Constants/buttons';
import { processSelectedVertexQueue } from 'Utility/state';
import pointerUpMainTargetReducer from 'Reducers/pointer-up-main-target-reducer';
import targetTypeFromKey from 'Utility/target-type-from-key';

const removeActivePointer = ({ activePointers }, { identifier }) => ({
  activePointers: activePointers.filter(
    (pointer) => pointer.identifier !== identifier
  ),
});

const reducer = (state, { data, type }) => {
  switch (type) {
    case BUTTONS.MAIN: {
      const { key } = data;
      const modifiedState = {
        ...state,
        ...removeActivePointer(state, data),
        ...processSelectedVertexQueue(state, data),
        queuedSelectedVertex: null,
        selectedVertexQueue: [],
      };

      return pointerUpMainTargetReducer(modifiedState, {
        data,
        type: targetTypeFromKey(key),
      });
    }
    case BUTTONS.AUXILARY:
      // @TODO: implement pan on middle (scroll) up
      return state;
    case BUTTONS.SECONDARY:
      // @TODO: implement right up.
      return state;
    default:
      return state;
  }
};

export default reducer;
