// src/js/components/html/Icon.js
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid';

import { Button } from 'components/html/resets';

const Icon = styled(
  Button,
  {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'height' && prop !== 'width'
  }
)`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  background: hsl(0,0%,50%);
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.15s ease-in-out,
    opacity 0.15s ease-in-out;
  vertical-align: middle;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: ${({ active }) => active ? '0 0 10px rgba(0,0,0,0.5) inset' : 'none'};
  }

  &:active:after {
    box-shadow: 0 0 10px rgba(0,0,0,0.5) inset;
  }

  &:disabled {
    &:after {
      box-shadow: 0 0 10px rgba(0,0,0,1) inset !important;
    }
  }
`;

export default Icon;
