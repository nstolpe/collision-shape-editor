// src/js/components/FlexResizer.js
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { dispatch } from 'react-redux';
import styled from 'styled-components';

import { resize } from 'App/actions/actions';

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

    return (<FlexResizer ref={flexResizer}>{React.Children.map(children, child => React.cloneElement(child, { width, height }))}</FlexResizer>);
};
