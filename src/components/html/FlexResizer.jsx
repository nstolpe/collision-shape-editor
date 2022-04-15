// src/js/components/html/FlexResizer.jsx
import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';

import throttle from 'tools/throttle';

const FlexWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

// resizes on window.resize, stores width and height, sends them as props to children.
const FlexResizer = ({ callback, children }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const resizeRef = useCallback(el => {
    const interval = 50;
    const resize = throttle(() => {
      const width = el?.offsetWidth ?? 0;
      const height = el?.offsetHeight ?? 0;

      setWidth(width);
      setHeight(height);
      callback?.(width, height);
    }, interval);

    window.addEventListener('resize', resize);

    resize();

    return () => window.removeEventListener('resize', resize);
  }, [callback]);

  return (
    <FlexWrapper ref={resizeRef}>
      {children(width, height)}
    </FlexWrapper>
  );
};

export default FlexResizer;
