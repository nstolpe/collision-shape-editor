// src/js/components/FileUploader.js
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from "react-redux";
import styled from 'styled-components';

const Label = styled.label`
    display: inline-block;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 1.8em;
    font-weight: bold;
    width: 54px;
    height: 54px;
    line-height: 54px;
    vertical-align: middle;
    text-align: center;
    background-color: #c2c2c2;
    color: #ffffff;
`;

const Input = styled.input`
    display: none;
`;

const Span = styled.span`
    mix-blend-mode: difference;
`;

const eventLog = event => console.log(event.type);
const FileLoader = ({ text }) => {
    return(
        <Label htmlFor="file-uploader">
            <Span>{text}</Span>
            <Input onChange={e => console.log(e.target.files)} onInput={eventLog} onCancel={eventLog} onBlur={eventLog} type="file" id="file-uploader" />
        </Label>
    );
}

FileLoader.defaultProps = {
    text: 'file',
};

FileLoader.propTypes = {
    text: PropTypes.string,
};
export default FileLoader
