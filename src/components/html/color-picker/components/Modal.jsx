// src/js/components/html/color-picker/components/Modal.jsx
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled/macro';

import {
  setIsModalDragging,
  setModalElement,
  useStoreContext,
} from 'components/html/color-picker/store/Store';

const Panel = styled.div`
  cursor: move;
  font-size: 16px;
  transform: translate(${({ left, top }) => `${left}px, ${top}px`});
  top: 0;
  left: 0;
  line-height: 1.5;
  position: absolute;
  opacity: ${({ active }) => active ? 1 : 0};
  pointer-events: ${({ active }) => active ? 'auto' : 'none'};
  z-index: 1000;
  background-color: hsl(0, 0%, 75%);
  margin: 0 !important;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 4px;
  box-shadow: 0 0 4px 0px rgba(0,0,0,0.6);
  transition: opacity 0.15s ease-in-out;
`;

Panel.displayName = 'Panel';

const ModalHeader = styled.h3`
  background-color: hsl(0,0%,25%);
  border-radius: 4px;
  color: hsl(0,0%,75%);
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: 1.25em;
  line-height: 1.2;
  margin: 0 0 0.8em;
  pointer-events: none;
  text-align: center;
  user-select: none;
`;

ModalHeader.displayName = 'ModalHeader';

const throttle = (handler, wait=100) => {
  let last = Date.now();

  return event => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      handler(event);
    }
  };
};

const usePanelHooks = () => {
  const {
    dispatch,
    modalElement,
    triggerElement,
} = useStoreContext();
  const [panelLeft, setPanelLeft] = useState(null);
  const [panelTop, setPanelTop] = useState(null);
  const [panelInteractionCoordinates, setPanelInteractionCoordinates] = useState();
  // set the starting position for the panel and store a reference to the element
  const panelRefCallback = useCallback(panel => {
    if (panel !== null && triggerElement !== null) {
      const triggerRect = triggerElement.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      dispatch(setModalElement(panel));
      setPanelLeft(triggerRect.x);
      setPanelTop(triggerRect.y - panelRect.height);
    }
  }, [dispatch, triggerElement]);

  const pointerDown = ({ clientX: x, clientY: y, pointerId, target }) => {
    if (target === modalElement) {
      setPanelInteractionCoordinates({ x, y });
      modalElement.setPointerCapture(pointerId);
      dispatch(setIsModalDragging(true));
    }
  };

  const pointerMove = ({ clientX: x, clientY: y}) => {
    if (panelInteractionCoordinates) {
      const leftDiff = x - panelInteractionCoordinates.x;
      const topDiff = y - panelInteractionCoordinates.y;
      setPanelInteractionCoordinates({ x, y });
      setPanelLeft(panelLeft => (panelLeft + leftDiff));
      setPanelTop(panelTop => (panelTop + topDiff));
    }
  };

  const pointerUp = ({ pointerId }) => {
    setPanelInteractionCoordinates(null);
    modalElement.releasePointerCapture(pointerId);
    dispatch(setIsModalDragging(false));
  };

  return {
    panelLeft,
    panelTop,
    panelRefCallback,
    pointerDown,
    pointerMove,
    pointerUp,
  };
};

const Modal = ({
  children,
  container,
  title,
  titleFontFamily,
}) => {
  const {
    panelLeft,
    panelTop,
    panelRefCallback,
    pointerDown,
    pointerMove,
    pointerUp,
  } = usePanelHooks();
  const { isActive } = useStoreContext();

  return createPortal(
    <Panel
      active={isActive}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onPointerMove={throttle(pointerMove)}
      left={panelLeft}
      top={panelTop}
      ref={panelRefCallback}
    >
      <ModalHeader fontFamily={titleFontFamily}>{title}</ModalHeader>
      {children}
    </Panel>,
    container
  );
};

Modal.defaultProps = {
  children: [],
  container: document.body,
  title: 'Modal Dialog',
  titleFontFamily: 'sans-serif',
};

Modal.propTypes = {
  container: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string,
  titleFontFamily: PropTypes.string,
};

export default Modal;
