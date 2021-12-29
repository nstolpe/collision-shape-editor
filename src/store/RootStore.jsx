// src/js/store/RootStore.js
import React, { useReducer } from 'react';

import RootContext from 'contexts/RootContext';
import {
  reducer as rootReducer,
  initialState as rootInitialState,
} from 'reducers/root-reducer';
import {
  reducer as pressedKeysReducer,
  initialState as pressedKeysInitialState,
} from 'reducers/modifier-keys-reducer';
import combineReducers from 'tools/combine-reducers';

const RootStore = ({ children }) => {
  const reducer = combineReducers(
    pressedKeysReducer,
    rootReducer,
  );
  const initialState = {
    ...rootInitialState,
    ...pressedKeysInitialState
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RootContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RootContext.Provider>
  );
};

export default RootStore;
