// src/js/store/RootStore.js
import React, { useReducer } from 'react';

import RootContext from 'Contexts/RootContext';
import {
  reducer as rootReducer,
  initialState as rootInitialState,
} from 'Reducers/root-reducer';
import {
  reducer as activePointersReducer,
  initialState as activePointersInitialState,
} from 'Reducers/active-pointers';
import {
  reducer as modifierKeysReducer,
  initialState as modifierKeysInitialState,
} from 'Reducers/modifier-keys-reducer';
import pointerEventsReducer, {
  initialState as pointerEventsInitialState,
} from 'Reducers/pointer-events';
import {
  reducer as viewportReducer,
  initialState as viewportInitialState,
} from 'Reducers/viewport-reducer';

import combineReducers from 'Utility/combine-reducers';

const RootStore = ({ children }) => {
  const reducer = combineReducers(
    rootReducer,
    activePointersReducer,
    modifierKeysReducer,
    pointerEventsReducer,
    viewportReducer
  );
  const initialState = {
    ...rootInitialState,
    ...activePointersInitialState,
    ...modifierKeysInitialState,
    ...pointerEventsInitialState,
    ...viewportInitialState,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RootContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RootContext.Provider>
  );
};

export default RootStore;
