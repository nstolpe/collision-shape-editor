// src/js/components/FlexResizer.js
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import styled from 'styled-components';

const FlexResizer = styled.div`
    flex: 1;
    overflow: hidden;
`;

// resizes on window.resize, stores width and height, sends them to children.
export default ({ children }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const flexResizer = useRef(null);

    useEffect(() => {
        const resize = () => {
            setWidth(flexResizer.current.offsetWidth);
            setHeight(flexResizer.current.offsetHeight);
        };

        window.addEventListener('resize', resize);
        resize();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (<FlexResizer ref={flexResizer}>{React.Children.map(children, child => React.cloneElement(child, { width, height }))}</FlexResizer>);
};
