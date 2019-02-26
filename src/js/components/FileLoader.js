// src/js/components/FileUploader.js
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

const FileLoader = props => {
    return(
        <Label htmlFor="file-uploader">
            File
            <Input onChange={e => console.log(e.target.files)} type="file" id="file-uploader" />
        </Label>
    );
}

export default FileLoader
