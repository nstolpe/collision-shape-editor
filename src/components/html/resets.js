// src/components/html/resets.js
import styled from '@emotion/styled/macro';

export const Button = styled.button`
  outline: none;
  border: 0;
  font-family: inherit;
  font-size: 100%;
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

Button.displayName = Button;

export default {
  Button,
};
