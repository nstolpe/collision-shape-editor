// src/js/components/ScreenWrapper.js
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import styled from 'styled-components';

const ScreenWrapper = styled.div`
    flex: 1;
    overflow: hidden;
`;

export default ({ children }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const screenWrapper = useRef(null);

    useEffect(() => {
        const resize = () => {
            setWidth(screenWrapper.current.offsetWidth);
            setHeight(screenWrapper.current.offsetHeight);
        };

        window.addEventListener('resize', resize);
        resize();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return (<ScreenWrapper ref={screenWrapper}>{React.Children.map(children, child => React.cloneElement(child, { width, height }))}</ScreenWrapper>);
};
