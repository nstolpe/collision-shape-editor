// src/js/components/html/SelectIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import Icon from 'components/html/Icon';

const Pointer = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  &:after {
    content: '';
    background-color: ${({ active }) => active ? '#ffa500' : '#000000'};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(14% 14%, 40% 80%, 86% 86%, 80% 40%);
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

Pointer.displayName = 'Pointer';

const SelectIcon = props => {
  const { active } = props;

  return (
    <Icon {...props}>
      <Pointer active={active} />
    </Icon>
  );
};

SelectIcon.propTypes = {
  active: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

SelectIcon.defaultProps = {
  active: false,
  height: '56px',
  width: '56px',
};

export default SelectIcon;

