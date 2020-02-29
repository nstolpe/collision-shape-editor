// src/js/components/html/SpriteIcon.js
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import Icon from 'components/html/Icon';

const Top = styled.div`
  border: solid #ff0000;
  border-width: 2px 2px 0 2px;
  height: 50%;
  width: 50%;
  background-color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  position: relative;
  border-radius: 50% 50% 0 0;
  margin: -6% auto 0;
  transition: background-color 0.15s ease-in-out;

  &:after {
    content: '';
    background: hsl(0,0%,50%);
    border-radius: 50%;
    height: 20%;
    width: 20%;
    right: 20%;
    top: 50%;
    position: absolute;
  }

  &:before {
    content: '';
    background: hsl(0,0%,50%);
    border-radius: 50%;
    height: 20%;
    width: 20%;
    left: 20%;
    top: 50%;
    position: absolute;
  }

  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    background-color: #ffa500;
  }
`;

const Middle = styled.div`
  height: 10%;  border: solid #ff0000;
  border-width: 0 2px;
  width: 50%;
  background-color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  position: relative;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  transition: background-color 0.15s ease-in-out;

  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    background-color: #ffa500;
  }
`;

const Bottom = styled.div`
  border: solid #ff0000;
  border-width: 0 2px 2px 0;
  transition: border-color 0.15s ease-background-out;
  background-color: ${({ active }) => active ? '#ffa500' : '#ffffff'};
  height: 89.3%;
  width: 17.86%;
  transform: rotate(45deg) translate(25%, 25%);
  transition: background-color 0.15s ease-in-out;

  ${Icon}:active &,
  ${Icon}:focus &,
  ${Icon}:hover & {
    background-color: #ffa500;
  }
`;

const SpriteIcon = props => {
  const { active } = props;

  return (
    <Icon {...props}>
      <Top active={active} />
      <Middle active={active}>
        <Bottom active={active} />
        <Bottom active={active} />
        <Bottom active={active} />
        <Bottom active={active} />
      </Middle>
    </Icon>
  );
};

SpriteIcon.propTypes = {
  active: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

SpriteIcon.defaultProps = {
  active: false,
  height: '56px',
  width: '56px',
};

export default SpriteIcon;
