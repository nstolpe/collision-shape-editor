// src/js/components/html/PlusIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Icon from 'Components/html/Icon';
import { Minus } from 'Components/html/MinusIcon';

const Plus = styled(Minus)`
  &:before {
    content: '';
    position: absolute;
    background-color: ${({ active }) => active ? '#ffa500' : '#000000'};
    top: 15%;
    bottom: 15%;
    width: 10%;
    left: 50%;
    transform: translateX(-50%);
    transition: background-color 0.15s ease-in-out;
  }

  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    &:before {
      background-color: #ffa500;
    }
  }

  ${Icon}:disabled & {
    background-color: hsl(0,0%,35%);
    &:before {
      background-color: hsl(0,0%,30%);
    }
  }
`;


const PlusIcon = props => {
  const { active } = props;

  return (
    <Icon {...props}>
      <Plus active={active} />
    </Icon>
  );
};

PlusIcon.propTypes = {
  active: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

PlusIcon.defaultProps = {
  active: false,
  height: '64px',
  width: '64px',
};

export default PlusIcon;

