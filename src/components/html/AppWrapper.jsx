// src/js/components/AppWrapper.js
import React, { useCallback } from 'react';
import styled from '@emotion/styled';

import { setRootContainer } from 'actions/actions';
import { useRootContext } from 'contexts/RootContext';

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    font-size: 10px;
    line-height: 1.5rem;
`;

const AppWrapper = ({ children }) => {
  const { dispatch } = useRootContext();
  const rootContainerRef = useCallback(wrapper => {
    if (wrapper !== null) {
      dispatch(setRootContainer(wrapper));
    }
  }, [dispatch]);

  return <Wrapper ref={rootContainerRef}>{children}</Wrapper>;
};

export default AppWrapper;
