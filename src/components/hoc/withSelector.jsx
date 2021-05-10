import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
} from 'react';

/**
 * Takes a `value` and `comparator` function. The `comparator`
 * will be called with `value` and last different value that
 * was passed to the hook instance. If `comparator` returns
 * `false`, `value` will override `ref.current` and will
 * be called as the second argument of `comparator` next time
 * this hook instance is called. Returns `value` or the previous
 * `value`.
 * From: https://github.com/Sanjagh/use-custom-compare-effect/blob/master/src/index.js
 *
 * @param {*} value   A value that should only change when conditions are met
 * @param {Function}  A function that takes two arguments (probably objects) and performs
 *                    a comparison on them. Returns true if the comparison finds equality
 *                    and false if it doesn't.
 */
export const useCustomCompareMemo = (value, comparator) => {
  const ref = useRef(value);

  if (!comparator(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

/**
 * A default comparator for the HOC. `values` and `oldValues` are props objects,
 * and corresponding keys on each are compared with `!==`.
 */
export const defaultComparator = (values, oldValues) => {
  const entries = Object.entries(values);

  for (let i = 0, l = entries.length; i < l; i ++) {
    const [key, value] = entries[i];

    if (value !== oldValues[key]) {
      return false;
    }
  }

  return true;
};

/**
 * HOC that returns a memoized version of the wrapped component that has
 * isolated access to data available in the `context` argument. Data from
 * `context` is chosen by the `selector` function, which should take the
 * context's data as its only argument. The wrapped component will receive
 * the return value of `selector` as props.
 *
 * @param context    {object}        A React Context
 * @param selector   {Function}      A function that retrieves data from the context
 * @param comparator {Function}      A function that takes two arguments and compares them.
 * @param WrappedComponent {object}  A React Component
 */
const withSelector = (
  context = createContext(),
  selector = values => values,
  comparator = defaultComparator
) => WrappedComponent => {
  const WrapperComponent = props => {
    const ctx = selector(useContext(context));
    const mergedProps = { ...useCustomCompareMemo(ctx, comparator), ...props };

    return useMemo(
      () => <WrappedComponent {...mergedProps} />,
      [mergedProps]
    );
  };

  return WrapperComponent;
};

export default withSelector;
