// src/js/components/html/EdgeIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid'

import { Button } from 'components/html/resets';

const Icon = styled(
  Button,
  {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'height' && prop !== 'width'
  }
)(({ active, height, width }) => ({
  height,
  width,
  background: 'hsl(0,0%,50%)',
  borderRadius: '4px',
  boxShadow: active ? '0 0 10px rgba(0,0,0,0.5) inset' : 'none',
  cursor: 'pointer',
  display: 'inline-block',
  position: 'relative',
  transition: 'box-shadow 0.15s ease-in-out',
  verticalAlign: 'middle',
  ['&:active']: {
    boxShadow: '0 0 10px rgba(0,0,0,0.5) inset',
  }
}));

const Edges = styled.div`
  border-width: 2px;
  border-style: solid;
  border-top-color: #ff0000;
  border-right-color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  border-bottom-color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  border-left-color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  height: 50%;
  width: 50%;
  margin: auto;
  transform: rotate(45deg);
  transition: border-color 0.15s ease-in-out;

  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    border-right-color: #ffa500;
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
`;

const EdgeIcon = ({ active, height, width }) => {
  const iconProps = { active, height, width, type: 'button' };

  return (
    <Icon {...iconProps}>
      <Edges active={active} />
    </Icon>
  );
};

EdgeIcon.propTypes = {
  active: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

EdgeIcon.defaultProps = {
  active: false,
  height: '56px',
  width: '56px',
};

export default EdgeIcon;

