// src/js/components/html/PlusIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import Icon from 'components/html/Icon';

export const Minus = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &:after {
    content: '';
    position: absolute;
    left: 15%;
    right: 15%;
    height: 10%;
    background-color: ${({ active }) => active ? '#ffa500' : '#000000'};
    top: 50%;
    transform: translateY(-50%);
    transition: background-color 0.15s ease-in-out;
  }

  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    &:after {
      background-color: #ffa500;
    }
  }

  ${Icon}:disabled & {
    background-color: hsl(0,0%,35%);
    &:after {
      background-color: hsl(0,0%,30%);
    }
  }
`;

const MinusIcon = props => {
  const { active } = props;

  return (
    <Icon {...props}>
      <Minus active={active} />
    </Icon>
  );
};

MinusIcon.propTypes = {
  active: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

MinusIcon.defaultProps = {
  active: false,
  height: '64px',
  width: '64px',
};

export default MinusIcon;

