// src/js/components/html/FileUploader.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Input = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
`;

const Label = styled.label`
  display: inline-block;
  font-family: 'Fira Mono';
  font-size: 1.8em;
  width: 64px;
  height: 64px;
  line-height: 64px;
  vertical-align: middle;
  text-align: center;
  background-color: hsl(0,0%,50%);
  color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  user-select: none;
  border-radius: 4px;
  position: relative;

  &.active,
  &:hover,
  &:focus-within {
    color: #ffa500;
  }

  &:active {
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5) inset;
  }

  box-shadow: ${({ active }) => active ? '0px 0px 10px rgba(0,0,0,0.5) inset' : 'none'};
`;

const Span = styled.span`
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
    reader.onload = event => onLoad(file.name, event);
    reader.onloadend = onLoadend;
    reader.onloadstart = onLoadstart;
    reader.onprogress = onProgress;

    reader.readAsDataURL(file);
  }
};

const FileLoader = ({
  text,
  onChange,
  onAbort,
  onError,
  onLoad,
  onLoadend,
  onLoadstart,
  onProgress,
  ...htmlProps
}) => {
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  return(
    <Label htmlFor="file-uploader" active={active}>
      <Span>{text}</Span>
      <Input
        onChange={onChange}
        onPointerDown={e => {
          setPressed(true);
        }}
        onPointerOut={e => {
          if (pressed && !active) {
            setPressed(false);
          }
        }}
        onPointerUp={e => {
          if (pressed) {
            const windowFocus = e => {
              setPressed(false);
              setActive(false);
              window.removeEventListener('focus', windowFocus);
            };

            setActive(true);
            window.addEventListener('focus', windowFocus);
          }
        }}
        type="file"
        id="file-uploader"
        { ...htmlProps }
      />
    </Label>
  );
}

FileLoader.defaultProps = {
  text: 'load',
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
