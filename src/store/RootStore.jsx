// src/js/store/RootStore.js
import React, { useReducer } from 'react';

import RootContext from 'contexts/RootContext';
import reducer, { initialState } from 'reducers/root-reducer';


const RootStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <RootContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RootContext.Provider>
  );
};

export default RootStore;
