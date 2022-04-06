// src/hooks/useThrottle.js
import { useEffect, useRef, useCallback } from 'react';

import throttle from 'tools/throttle';

const useThrottle = (callback, dependencies, wait=100) =>
  useCallback(throttle(callback, wait), dependencies);

export default useThrottle;
