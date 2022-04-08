// src/components/html/ValueMonitor.js
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Ul, Input } from 'components/html/resets';

const Wrapper = styled.div(`
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  width: 64px;
  height: 64px;
  font-family: 'Fira Mono';
  justify-content: space-between;
`, ({ styles }) => styles);

const Header = styled.h6(`
  color: hsl(0,0%,75%);
  background-color: hsl(0,0%,25%);
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
  border-radius: 4px;
`, ({ styles }) => styles);

const ValueWrapper = styled.label(`
  background-color: #ffffff;
  display: flex;
  font-size: 1.2rem;
  border-radius: 4px;
  padding: 0 0 0 0.4rem;
`, ({ styles }) => styles);

const ValueLabel = styled.span(({ styles }) => styles);

const ValueInput = styled(Input)(`
  width: 100%;
`, ({ styles }) => styles);

const Value = ({
  type,
  label,
  title,
  value,
  disabled,
  styles,
  labelStyles,
  inputStyles,
  onChange,
  step=1,
}) => {
  const extraProps = type === 'number' && { step };

  return (
    <ValueWrapper title={title} styles={styles}>
      <ValueLabel styles={labelStyles}>{label}: </ValueLabel>
      <ValueInput
        type={type}
        value={value ?? ''}
        disabled={disabled}
        styles={inputStyles}
        onChange={onChange}
        {...extraProps}
      />
    </ValueWrapper>
  );
};

Value.propTypes = {
  type: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  styles: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  labelStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  inputStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

Value.defaultProps = {
  type: 'text',
  disabled: false,
  styles: {},
  labelStyles: {},
  inputStyles: {},
};

const ValueMonitor = ({
  name,
  title,
  styles,
  values,
  headerStyles,
}) => {
  return (
    <Wrapper title={title} styles={styles}>
      <Header styles={headerStyles}>{name}</Header>
      {values.map((props, i) => <Value {...props} key={`${i}-${name}`}/>)}
    </Wrapper>
  )
};

ValueMonitor.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // applied to Wrapper. Target elements with css string or object. passed to emotion.styled
  styles: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  headerStyles: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // see Value.propTypes
  values: PropTypes.array,
};

ValueMonitor.defaultProps = {
  name: '',
  styles: {},
  headerStyles: {},
  title: '',
  values: [],
};


export default ValueMonitor;
