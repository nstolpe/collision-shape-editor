// src/js/contexts/ScreenContext.js
import { createContext, useContext } from 'react';

const ScreenContext = createContext();

export const useScreenContext = () => useContext(ScreenContext);

export default ScreenContext;
