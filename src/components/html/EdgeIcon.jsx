// src/js/components/html/EdgeIcon.js
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
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5) inset;
  }
`;

const Edges = styled.div`
  border-width: 2px;
  border-style: solid;
  border-top-color: #ff0000;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  border-left-color: #ffffff;
  height: 50%;
  width: 50%;
  margin: auto;
  transform: rotate(45deg);
  transition: border-color 0.15s ease-in-out;

  ${Icon}.active &,
  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    border-right-color: #ffa500;
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
`;

const EdgeIcon = ({ active, height, width }) => {
  const props = { height, width, type: 'button' };

  if (active) {
    props.className = 'active';
  }

  return (
    <Icon {...props}>
      <Edges />
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

