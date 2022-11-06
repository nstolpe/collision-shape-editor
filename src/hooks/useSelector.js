// hooks/useSelector
import { useContext } from 'react';

import useCustomCompareMemo from 'Hooks/useCustomCompareMemo';

const useSelector = (context, selector, comparator) => {
  return useCustomCompareMemo(selector(useContext(context)), comparator);
};

export default useSelector;
