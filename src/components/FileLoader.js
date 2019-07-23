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
    user-select: none;
`;

const Input = styled.input`
    display: none;
`;

const Span = styled.span`
    mix-blend-mode: difference;
`;

const eventLog = event => console.log(event.type);

const loadWrapper = (
    syntheticEvent,
    onAbort,
    onError,
    onLoad,
    onLoadend,
    onLoadstart,
    onProgress,
) => {
    const file = syntheticEvent.nativeEvent.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onabort = onAbort;
        reader.onerror = onError;
        reader.onload = event => onLoad(file.name, event.target.result);
        reader.onloadend = onLoadend;
        reader.onloadstart = onLoadstart;
        reader.onprogress = onProgress;

        reader.readAsDataURL(file);
    }
};

const FileLoader = (props) => {
    const {
        text,
        onAbort,
        onError,
        onLoad,
        onLoadend,
        onLoadstart,
        onProgress,
        ...htmlProps
    } = props;
    return(
        <Label htmlFor="file-uploader">
            <Span>{text}</Span>
            <Input onChange={event => loadWrapper(
                    event,
                    onAbort,
                    onError,
                    onLoad,
                    onLoadend,
                    onLoadstart,
                    onProgress,
                )}
                onInput={eventLog}
                onCancel={eventLog}
                onBlur={eventLog}
                type="file"
                id="file-uploader"
                { ...htmlProps }
            />
        </Label>
    );
}

FileLoader.defaultProps = {
    text: 'file',
    accept: '',
    onAbort: event => event,
    onError: event => event,
    onLoad: event => event,
    onLoadend: event => event,
    onLoadstart: event => event,
    onProgress: event => event,
};

FileLoader.propTypes = {
    text: PropTypes.string,
    onAbort: PropTypes.func,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadend: PropTypes.func,
    onLoadstart: PropTypes.func,
    onProgress: PropTypes.func,
};

export default FileLoader;
