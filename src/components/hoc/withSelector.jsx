import React, {
  createContext,
  useContext,
  useMemo,
} from 'react';

import restComparator from 'Comparators/rest';
import useCustomCompareMemo from 'Hooks/useCustomCompareMemo';

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
  comparator = restComparator
) => WrappedComponent => {
  const WrapperComponent = props => {
    const ctx = selector(useContext(context));
    const fileredProps = useCustomCompareMemo(ctx, comparator);
    // below was causing it to always rerender, since fileredProps was always a new object.
    // this seems to be good. delete once it's no longer needed for reference
    // const fileredProps = { ...useCustomCompareMemo(ctx, comparator), ...props };

    return useMemo(
      () => <WrappedComponent {...{...fileredProps, ...props}} />,
      [fileredProps, props]
    );
  };

  return WrapperComponent;
};

export default withSelector;
