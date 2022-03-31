// src/components/html/resets.js
import styled from '@emotion/styled/macro';

export const Button = styled.button`
  outline: none;
  border: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.15;
  margin: 0;
  padding: 0;
  overflow: visible;
  text-transform: none;
  -webkit-appearance: button;
  &::-moz-focus-inner {
    border: 0;
  }
`;

export const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export const Input = styled.input`
  padding: 0;
  margin: 0;
  border: 0;
  line-height: 1.5;
  background: transparent;
`;
