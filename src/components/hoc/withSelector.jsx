import React, { createContext, useContext, useMemo } from 'react';

import useCustomCompareMemo from 'hooks/useCustomCompareMemo';

const defaultComparator = (values, oldValues) => {
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
 * @param context    {object}    A React Context
 * @param selector   {Function}  A function that retrieves data from the context
 * @param comparator {Function}  A function that takes two arguments and compares them.
 * @param WrappedComponent {object}  A React Component
 */
export const withSelector = (
  context = createContext(),
  selector = values => values,
  comparator = defaultComparator
) => WrappedComponent => {
  const WrapperComponent = props => {
    const ctx = selector(useContext(context));
    const mergedProps = useCustomCompareMemo({ ...props, ...ctx }, comparator);

    return useMemo(
      () => <WrappedComponent {...mergedProps} />,
      [mergedProps]
    );
  };

  return WrapperComponent;
};

export default withSelector;
