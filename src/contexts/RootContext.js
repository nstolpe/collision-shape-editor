// src/js/contexts/ScreenContext.js
import { createContext, useContext } from 'react';

const RootContext = createContext();

export const useRootContext = () => useContext(RootContext);

export default RootContext;
