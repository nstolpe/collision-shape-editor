// src/js/components/html/AppWrapper.js
import React, { useCallback } from 'react';
import styled from '@emotion/styled';

import { setRootContainer } from 'actions/actions';
import RootContext from 'contexts/RootContext';
import withSelector from 'components/hoc/withSelector';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  font-size: 10px;
  line-height: 1.5rem;
`;

const selector = ({ dispatch }) => ({ dispatch });

const AppWrapper = ({ children, dispatch }) => {
  const rootContainerRef = useCallback(
    wrapper => dispatch(setRootContainer(wrapper)),
    [dispatch]
  );

  return <Wrapper ref={rootContainerRef}>{children}</Wrapper>;
};

export default withSelector(RootContext, selector)(AppWrapper);
