// src/js/components/html/Separator.js
import styled from '@emotion/styled';

const Separator = styled.div`
  background: hsla(0, 0%, 50%, 1);
  display: inline-block;
  position: relative;
  width: 2px;
  height: 100%;
  vertical-align: middle;
  opacity: .5;

  &:before, &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 15%;
    background: hsl(0, 0%, 50%);
  }

  &:before {
    bottom: 90%;
  }

  &:after {
    top: 90%;
  }
`;

export default Separator;
