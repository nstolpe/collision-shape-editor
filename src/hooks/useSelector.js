// hooks/useSelector
import { useContext } from 'react';

import useCustomCompareMemo from 'hooks/useCustomCompareMemo';

const useSelector = (context, selector, comparator) => {
  return useCustomCompareMemo(selector(useContext(context)), comparator);
};

export default useSelector;
