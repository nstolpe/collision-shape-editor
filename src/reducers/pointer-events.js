import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
} from 'Constants/pointer-events';
import { buttonFromNumber } from 'Constants/buttons';
import pointerDownButtonReducer from 'Reducers/pointer-down-button-reducer';
import pointerUpButtonReducer from 'Reducers/pointer-up-button-reducer';
import pointerMoveTargetReducer from 'Reducers/pointer-move-target-reducer';
import targetTypeFromKey from 'Utility/target-type-from-key';
import { EDGE, SHAPE, VERTEX, VIEWPORT } from 'Constants/prefixes';

export const initialState = {
  queuedSelectedVertex: null,
  selectedVertexQueue: [],
};

/************************** ACTIONS **************************/
export const pointerDown = ({
  button,
  coordinates,
  identifier,
  key,
  position,
  // @TODO try deriving key (name) and position from target
  target,
}) => ({
  type: POINTER_DOWN,
  data: { button, coordinates, identifier, key, position, target },
});

export const pointerMove = ({ coordinates, identifier, key, position }) => ({
  type: POINTER_MOVE,
  data: { coordinates, identifier, key, position },
});

export const pointerUp = ({
  button,
  coordinates,
  identifier,
  key,
  position,
}) => ({
  type: POINTER_UP,
  data: { button, coordinates, identifier, key, position },
});
/*************************************************************/

// checks if a pointer is active. bool
const getActivePointerByIdentifier = (activePointers, identifier) =>
  activePointers.find(
    (activePointer) => activePointer.identifier === identifier
  );

const reducer = (state, { data, type }) => {
  switch (type) {
    case POINTER_DOWN: {
      const { button } = data;

      return pointerDownButtonReducer(state, {
        data,
        type: buttonFromNumber(button),
      });
    }
    case POINTER_MOVE: {
      const { activePointers } = state;

      // no pointers are active, exit early
      if (!activePointers.length) {
        return state;
      }

      const { coordinates, identifier } = data;
      const activePointer = getActivePointerByIdentifier(
        activePointers,
        identifier
      );

      // this pointer isn't active, exit early
      if (activePointer === undefined) {
        return state;
      }

      const modifiedState = {
        ...state,
        activePointers: state.activePointers.map((pointer) => {
          if (pointer.identifier === identifier) {
            return { ...pointer, coordinates };
          }
          return pointer;
        }),
      };

      return pointerMoveTargetReducer(modifiedState, {
        data: { ...data, key: activePointer.key },
        type: targetTypeFromKey(activePointer.key),
      });
    }
    case POINTER_UP: {
      const { activePointers } = state;

      // no pointers are active, exit early
      if (!activePointers.length) {
        return state;
      }

      const { button, identifier } = data;
      const activePointer = getActivePointerByIdentifier(
        activePointers,
        identifier
      );

      // this pointer isn't active, exit early
      if (activePointer === undefined) {
        return state;
      }

      return pointerUpButtonReducer(state, {
        data: { ...data, key: activePointer.key },
        type: buttonFromNumber(button),
      });
    }
    default:
      return state;
  }
};

export default reducer;
