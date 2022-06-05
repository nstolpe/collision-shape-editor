// src/components/html/hoc/withContextMenu.jsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid';

const Screen = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Modal = styled(
  'div',
  {
    shouldForwardProp: prop => isPropValid(prop),
  },
)(props => ({
  background: 'hsl(0, 0%, 75%)',
  fontFamily: 'Fira Mono',
  fontSize: '1.6rem',
  position: 'fixed',
  left: `${props.left}px`,
  top: `${props.top}px`,
  borderRadius: '0.4rem',
  boxShadow: '0 0 4px 0px rgb(0 0 0 / 60%)',
  transition: 'opacity 0.15s ease-in-out',
  whiteSpace: 'nowrap',
}));

const withContextMenu = WrappedComponent => ({
  portalTarget,
  isOpen,
  x,
  y,
  close,
  ...props
}) => {
  const screenRef = useRef();
  const onPointerDown = ({ target }) => {
    if (target === screenRef.current) {
      close();
    }
  };

  useEffect(() => {
    const closeHandler = ({ key }) => {
      if (key === 'Escape' || key === 'Esc') {
        close();
        // @TODO have a global keydown (and keyup) listener that calls
        // a bunch of callbacks (like this) that have been registered with it
        document.removeEventListener('keydown', closeHandler);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', closeHandler);
    }

    return () => {
      document.removeEventListener('keydown', closeHandler);
    };
  }, [close, isOpen]);

  return (
    portalTarget && isOpen ?
      createPortal(
        <Screen
          ref={screenRef}
          onPointerDown={onPointerDown}
          onContextMenu={e => e.preventDefault()}
        >
          <Modal left={x} top={y}>
            <WrappedComponent {...props} />
          </Modal>
        </Screen>,
        portalTarget,
      ) :
      null
  );
};

export default withContextMenu;
