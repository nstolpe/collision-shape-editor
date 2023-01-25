import BUTTONS from 'Constants/buttons';
import pointerDownMainTargetReducer from 'Reducers/pointer-down-main-target-reducer';
import targetTypeFromKey from 'Utility/target-type-from-key';
import pointerDownSecondaryTargetReducer from 'Reducers/pointer-down-secondary-target-reducer';

/**
 * projector/modifier. adds the active pointer identified by coordinates, identifier, and key
 * to state.activePointers and returns a state-like object: { activePointers }.
 */
const addActivePointer = (state, { coordinates, identifier, key }) => ({
  activePointers: [...state.activePointers, { coordinates, identifier, key }],
});

const reducer = (state, { data, type }) => {
  switch (type) {
    case BUTTONS.MAIN: {
      const { key } = data;
      // pass control to pointer-down-main-target-reducer and
      // add pointer to activePointers
      return {
        ...pointerDownMainTargetReducer(state, {
          data,
          type: targetTypeFromKey(key),
        }),
        ...addActivePointer(state, data),
      };
    }
    case BUTTONS.AUXILARY:
      // @TODO: implement pan on middle (scroll) click
      return state;
    case BUTTONS.SECONDARY: {
      const { key } = data;
      return pointerDownSecondaryTargetReducer(state, { data, type: key });
    }
    default:
      return state;
  }
};

export default reducer;
