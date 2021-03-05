import { useRef } from 'react';

/**
 * Takes a `value` and `comparator` function. The `comparator`
 * will be called with `value` and last different value that
 * was passed to the hook instance. If `comparator` returns
 * `false`, `value` will be override `ref.current` and will
 * be called as the second argument of `comparator` next time
 * this hook instances is called. Returns `value` or the previous
 * `value`.
 * From: https://github.com/Sanjagh/use-custom-compare-effect/blob/master/src/index.js
 *
 * @param {*} value   A value that should only change when conditions are met
 * @param {Function}  A function that takes two arguments (probably objects) and performs
 *                    a comparison on them. Returns true if the comparison finds equality
 *                    and false if it doesn't.
 */
const useCustomCompareMemo = (value, comparator) => {
  const ref = useRef(value);

  if (!comparator(value, ref.current)) {
    // console.log('update', value, ref.current)
    ref.current = value;
  }

  return ref.current;
};

export default useCustomCompareMemo;
