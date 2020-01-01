// src/js/components/Controls.js
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import chroma from 'chroma-js';

import {
    addTextureSource,
    setBackgroundColor,
} from 'actions/actions';
import ColorPicker from 'components/ColorPicker';
import FileLoader from 'components/FileLoader';
import {
    rgbToHexString,
} from 'tools/color';
import { useRootContext } from 'contexts/RootContext';

const Styled = styled.div`
    background-color: #ebebeb;
    padding: 1em;
    & > * {
        margin-right: 1em;
    }
`;

const mapStateToProps = (state, ownProps) => ({ ...state });

// const mapDispatchToProps = dispatch => ({
//     onChange: event => {
//         const colorString = event.target.value;
//         const color = parseInt(colorString.replace('#',''), 16);
//         dispatch(setBackgroundColor(color));
//     },
//     onColorChange: ({ r, g, b }) => {
//         const color = parseInt(rgbToHexString({ r, g, b }).replace('#',''), 16);
//         dispatch(setBackgroundColor(color));
//     },
//     onLoad: (name, data) => {
//         dispatch(addTextureSource(name, data))
//     },
// });

const Controls = ({ children }) => {
    const { backgroundColor, dispatch } = useRootContext();
    const onChange = event => {
        const colorString = event.target.value;
        const color = parseInt(colorString.replace('#',''), 16);
        dispatch(setBackgroundColor(color));
    };

    const onColorChange =({ r, g, b }) => {
        const color = chroma(r, g, b);
        dispatch(setBackgroundColor(parseInt(color.hex().replace('#', ''), 16)));
    };

    const onLoad = (name, data) => {
        dispatch(addTextureSource(name, data));
    };

    return(
        <Styled>
            <FileLoader onLoad={onLoad} accept="image/*" multiple />
            <ColorPicker initialColor={backgroundColor} onColorChange={onColorChange} />
            {children}
        </Styled>
    );
};

// export default connect(mapStateToProps, mapDispatchToProps)(Controls);
export default Controls;
