// src/hooks/hooks.js
import { useEffect, useRef } from 'React';

export const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default {
  usePrevious,
};
