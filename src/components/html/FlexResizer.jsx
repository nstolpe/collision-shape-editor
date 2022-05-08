// src/js/components/html/FlexResizer.jsx
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import throttle from 'tools/throttle';

const FlexWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

// resizes on window.resize, stores width and height, sends them as props to children.
const FlexResizer = ({ children }) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const resizeRef = useCallback(el => {
    const interval = 50;
    const resize = throttle(() => {
      const height = el?.offsetHeight ?? 0;
      const width = el?.offsetWidth ?? 0;

      setHeight(height);
      setWidth(width);
    }, interval);

    window.addEventListener('resize', resize);

    resize();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <FlexWrapper ref={resizeRef}>
      {children?.({ height, width })}
    </FlexWrapper>
  );
};

FlexResizer.propTypes = {
  children: PropTypes.func,
};

export default FlexResizer;
