// src/js/components/html/color-picker/components/ColorInputs.jsx
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled/macro';

import { useStoreContext } from 'components/html/color-picker/store/Store';

const ValuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1em;
  justify-content: flex-start;
  line-height: 1.5;
  pointer-events: none;
`;

ValuesWrapper.displayName = 'ValuesWrapper';

const ValueLabel = styled.label`
  display: flex;
  font-family: sans-serif;
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 1em;
  user-select: none;
`;

ValueLabel.displayName = 'ValueLabel';

const ValueSpan = styled.span`
  color: hsl(0,0%,25%);
  font-family: ${({ fontFamily }) => fontFamily};
  margin-right: 0.5em;
`;

ValueSpan.displayName = 'ValueSpan';

const Input = styled.input`
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 4px hsl(0,0%,25%) inset;
  box-sizing: border-box;
  cursor: text;
  font-size: 1em;
  line-height: 1.5;
  padding: 0 0.5em;
  width: 8em;
`;

Input.displayName = 'Input';

const ColorInputs = ({
  labelFontFamily,
}) => {
  const {
    activeColor,
    isActive,
    isModalDragging,
  } = useStoreContext();

  return (
    <ValuesWrapper>
      <ValueLabel>
        <ValueSpan fontFamily={labelFontFamily}>rgb:</ValueSpan>
        <Input
          type="text"
          value={`${activeColor.get('rgb.r')}/${activeColor.get('rgb.g')}/${activeColor.get('rgb.b')}`}
          disabled={isActive && !isModalDragging ? false : true}
        />
      </ValueLabel>
      <ValueLabel>
        <ValueSpan fontFamily={labelFontFamily}>hsv:</ValueSpan>
        <Input
          type="text"
          value={`${Math.round((activeColor.get('hsv.h') || 0) * 100) / 100}/${Math.round(activeColor.get('hsv.s') * 100) / 100}/${Math.round(activeColor.get('hsv.v') * 100) / 100}`}
          readOnly
          disabled={isActive && !isModalDragging ? false : true}
        />
      </ValueLabel>
      <ValueLabel>
        <ValueSpan fontFamily={labelFontFamily}>hex:</ValueSpan>
        <Input
          type="text"
          value={activeColor.hex().replace('#', '')}
          readOnly
          disabled={isActive && !isModalDragging ? false : true}
        />
      </ValueLabel>
    </ValuesWrapper>
  );
};

ColorInputs.propTypes = {
  labelFontFamily: PropTypes.string,
};

ColorInputs.defaultProps = {
  labelFontFamily: 'sans-serif',
};

export default ColorInputs;
