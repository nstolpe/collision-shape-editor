// src/js/components/html/FlexResizer.js
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';

const FlexWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

// resizes on window.resize, stores width and height, sends them as props to children.
const FlexResizer = ({ children }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const flexResizer = useRef(null);


  useEffect(() => {
    const interval = 50;
    let timeout;

    // throttled resize listener
    const resize = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        setWidth(flexResizer.current ? flexResizer.current.offsetWidth : 0);
        setHeight(flexResizer.current ? flexResizer.current.offsetHeight : 0);
      }, interval);
    };

    window.addEventListener('resize', resize);

    resize();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <FlexWrapper ref={flexResizer}>{
      React.Children.map(children, child => React.cloneElement(child, { width, height }))
    }</FlexWrapper>
  );
};

export default FlexResizer;
