// src/js/components/html/color-picker/components/Trigger.jsx
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid'

import {
  setIsActive,
  setTriggerElement,
  useStoreContext,
} from 'components/html/color-picker/store/Store';

export const Button = styled.button`
  outline: none;
  border: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 0;
  overflow: visible;
  text-transform: none;
  -webkit-appearance: button;
  &::-moz-focus-inner {
    border: 0;
  }
`;

Button.displayName = Button;

const TriggerButton = styled(
  Button,
  {
    shouldForwardProp: prop => isPropValid(prop) && prop !== 'height' && prop !== 'width'
  }
)(
  ({
    active,
    backgroundColor,
    height,
    width,
  }) => ({
    backgroundColor,
    height,
    width,
    boxShadow: active ? '0 0 10px rgba(0,0,0,0.5) inset' : 'none',
    borderRadius: '4px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'block',
    position: 'relative',
    textDecoration: 'none',
    transition: 'box-shadow 0.15s ease-in-out',
    verticalAlign: 'middle',
  })
);

TriggerButton.propTypes ={
  active: PropTypes.bool,
  backgroundColor: PropTypes.string,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  width:  PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  title: PropTypes.string,
};

TriggerButton.defaultProps = {
  active: false,
  backgroundColor: '#ffffff',
  height: '5.6em',
  width: '5.6em',
  title: 'Trigger',
};

const Trigger = ({
  title,
}) => {
  const {
    activeColor,
    isActive,
    modalElement,
    dispatch,
  } = useStoreContext();
  const toggleActive = event => {
    event.stopPropagation();
    dispatch(setIsActive(!isActive));
  };
  const triggerRefCallback = useCallback(trigger => {
    dispatch(setTriggerElement(trigger))
    /**
     * close the picker when anything outside of the trigger receives a pointerdown
     * or when escape is pressed
     * @TODO confirm this is the best way to handle escape
     */
    const close = event => {
      const { type, target, key, keyCode } = event;
      // const panel = trigger.nextElementSibling;
      let doClose = false;

      switch (type) {
        case 'keydown':
          if (isActive && (key === 'Escape' || key === 'Esc' || keyCode === 27)) {
            doClose = true;
          }
          break;
        case 'pointerdown':
          if (isActive && target !== trigger && (!modalElement || !modalElement.contains(target))) {
            doClose = true;
          }
          break;
        default:
          break;
      }

      if (doClose) {
        dispatch(setIsActive(false));
        document.removeEventListener('keydown', close);
        document.removeEventListener('pointerdown', close);
      }
    };

    if (trigger && isActive) {
      document.addEventListener('keydown', close);
      document.addEventListener('pointerdown', close);
    }

    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    };
  }, [dispatch, isActive, modalElement]);

  return (
    <TriggerButton
      active={isActive}
      backgroundColor={activeColor.hex()}
      onClick={toggleActive}
      ref={triggerRefCallback}
      title={title}
    />
  );
}
export default Trigger;
