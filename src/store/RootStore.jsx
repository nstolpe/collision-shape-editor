// src/js/store/RootStore.js
import React, { useReducer } from 'react';

import RootContext from 'contexts/RootContext';
import {
  reducer as rootReducer,
  initialState as rootInitialState,
} from 'reducers/root-reducer';
import {
  reducer as viewportReducer,
  initialState as viewportInitialState,
} from 'reducers/viewport-reducer';
import {
  reducer as modifierKeysReducer,
  initialState as modifierKeysInitialState,
} from 'reducers/modifier-keys-reducer';
import combineReducers from 'tools/combine-reducers';

const RootStore = ({ children }) => {
  const reducer = combineReducers(
    modifierKeysReducer,
    rootReducer,
    viewportReducer,
  );
  const initialState = {
    ...rootInitialState,
    ...modifierKeysInitialState,
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
