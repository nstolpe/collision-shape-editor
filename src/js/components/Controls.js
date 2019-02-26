// src/js/components/Controls.js
import React from 'react';
import { connect } from "react-redux";
import styled from 'styled-components';

import { setBackgroundColor } from 'App/actions/actions';
import ColorPicker from 'App/components/ColorPicker';
import FileLoader from 'App/components/FileLoader';
import {
    toHex,
    rgbToHex,
} from 'App/tools/color';

const Styled = styled.div`
    background-color: #ebebeb;
    padding: 1em;
    & > * {
        margin-right: 1em;
    }
`;

const mapStateToProps = (state, ownProps) => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onChange: event => {
        const colorString = event.target.value;
        const color = parseInt(colorString.replace('#',''), 16);
        dispatch(setBackgroundColor(color));
    },
    onColorChange: ({ r, g, b }) => {
        const color = parseInt(rgbToHex({ r, g, b }).replace('#',''), 16);
        dispatch(setBackgroundColor(color));
    }
});

const Controls = ({ children, backgroundColor, onChange, onColorChange }) => {
    return(
        <Styled>
            <FileLoader />
            <ColorPicker color={backgroundColor} onColorChange={onColorChange} />
            {children}
        </Styled>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
