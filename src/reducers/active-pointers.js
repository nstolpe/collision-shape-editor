// activePointers: [{ coordinates: { x, y }, identifier: number, targetId: string }]
export const initialState = {
  activePointers: [],
};

const ADD_ACTIVE_POINTER = 'ADD_ACTIVE_POINTER';
const REMOVE_ACTIVE_POINTER = 'REMOVE_ACTIVE_POINTER';
const UPDATE_ACTIVE_POINTER_COORDINATES = 'UPDATE_ACTIVE_POINTER_COORDINATES';

export const addActivePointer = ({ coordinates, identifier, targetId }) => ({
  type: ADD_ACTIVE_POINTER,
  data: { coordinates, identifier, targetId },
});

export const removeActivePointer = ({ identifier }) => ({
  type: REMOVE_ACTIVE_POINTER,
  data: { identifier },
});

export const updateActivePointerCoordinates = ({
  coordinates,
  identifier,
}) => ({
  type: UPDATE_ACTIVE_POINTER_COORDINATES,
  data: { coordinates, identifier },
});

export const reducer = (state, { data, type }) => {
  switch (type) {
    case ADD_ACTIVE_POINTER: {
      const { coordinates, identifier, targetId } = data;

      return {
        ...state,
        activePointers: [
          ...state.activePointers,
          { coordinates, identifier, targetId },
        ],
      };
    }
    case REMOVE_ACTIVE_POINTER: {
      const { identifier } = data;
      return {
        ...state,
        activePointers: state.activePointers.filter(
          (activePointer) => activePointer.identifier !== identifier
        ),
      };
    }
    case UPDATE_ACTIVE_POINTER_COORDINATES: {
      const { coordinates, identifier } = data;
      return {
        ...state,
        activePointers: state.activePointers.map((pointer) => {
          if (pointer.identifier === identifier) {
            return { ...pointer, coordinates };
          }
          return pointer;
        }),
      };
    }
    default:
      return state;
  }
};
