// src/js/contexts/RootContext.js
import { createContext, useContext } from 'react';

const RootContext = createContext();

export const useRootContext = () => useContext(RootContext);

export default RootContext;
