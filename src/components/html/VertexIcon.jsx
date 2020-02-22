// src/js/components/html/VertexIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import { Button } from 'components/html/resets';

const Icon = styled(Button)`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  background: hsl(0,0%,50%);
  position: relative;
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
  transition: box-shadow 0.15s ease-in-out;
  cursor: pointer;

  &:active,
  &.active {
    box-shadow: 0 0 10px rgba(0,0,0,0.5) inset;
  }
`;

const Edge = styled.div`
  position: absolute;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  transition: background-color 0.15s ease-in-out;

  ${Icon}.active &,
  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    background-color: #ffa500;
  }
`;

const End = styled(Edge)`
  right: calc(20% + 6px);
  left: calc(20% + 6px);
  align-items: center;
  height: 2px;

  :before {
    content: '';
    width: 6px;
    height: 6px;
    border: solid 1px red;
    position: absolute;
    border-radius: 50%;
    z-index: 1;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
  }

  :after {
    content: '';
    width: 6px;
    height: 6px;
    border: solid 1px red;
    position: absolute;
    border-radius: 50%;
    z-index: 1;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
  }
`;

const Side = styled(Edge)`
  bottom: calc(20% + 6px);
  top: calc(20% + 6px);
  width: 2px;
`;

const Top = styled(End)`
  top: 20%;
`;

const Bottom = styled(End)`
  bottom: 20%;
`;

const Right = styled(Side)`
  right: 20%;
`;

const Left = styled(Side)`
  left: 20%;
`;

const VertexIcon = ({ active, height, width }) => {
  const props = { height, width, type: 'button' };

  if (active) {
    props.className = 'active';
  }

  return (
    <Icon {...props}>
       <Top />
       <Right />
       <Bottom />
       <Left />
    </Icon>
  );
};

VertexIcon.propTypes = {
  active: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

VertexIcon.defaultProps = {
  active: false,
  height: '56px',
  width: '56px',
};

export default VertexIcon;
