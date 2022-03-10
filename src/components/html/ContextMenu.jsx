// src/components/html/ContextMenu.js
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid';

import {
  closeContextMenu,
  reverseShapeWinding,
  toggleShapeShowWinding,
  deleteShape,
} from 'actions/actions'
import { SHAPE } from 'constants/prefixes';
import RootContext from 'contexts/RootContext';
import withSelector from 'components/hoc/withSelector';
import { Button, Ul } from 'components/html/resets';

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

const ContextButton = styled(Button)`
  background-color: hsl(0, 0%, 75%);
  font-size: 1.6rem;
  text-decoration: underline 2px solid hsl(0, 0%, 75%);
  cursor: pointer;
  &:hover {
    text-decoration: underline 2px solid black;
  }
`;

const List = styled(Ul)`
  padding: 0 0.8rem 0.8rem;
`;

const Header = styled.h3`
  color: hsl(0,0%,75%);
  font-size: 1.25em;
  font-weight: bold;
  line-height: 1.2;
  background-color: hsl(0,0%,25%);
  margin: 0 0 0.4em;
  pointer-events: none;
  text-align: center;
  border-radius: 0.4rem 0.4rem 0 0;
  padding: 0 0.8rem;
`;

const selector = ({
  rootContainer,
  dispatch,
  contextMenu: {
    type,
    x,
    y,
    options,
  }
}) => ({
  rootContainer,
  dispatch,
  type,
  x,
  y,
  options,
});

const shapeContextMenuSelector = ({ dispatch }) => ({ dispatch });

const ShapeContextMenu = withSelector(RootContext, shapeContextMenuSelector)(
  ({ shape, shapeKey, dispatch }) => {
    const toggleWinding = () => {
      dispatch(toggleShapeShowWinding(shapeKey));
      dispatch(closeContextMenu());
      document.removeEventListener('keydown', onKeyDown);
    };
    const reverseWinding = () => {
      dispatch(reverseShapeWinding(shapeKey));
      dispatch(closeContextMenu());
      document.removeEventListener('keydown', onKeyDown);
    }
    const selectShapeVertices = (shapeKey, replace = false) => {
      if (replace) {
        console.log('@TODO setup state and dispatch for selectedVertices so this can replace the selection');
      } else {
        console.log('@TODO setup state and dispatch for selectedVertices so this can add to the selection');
      }
      dispatch(closeContextMenu());
      document.removeEventListener('keydown', onKeyDown);
    };
    const removeShape = () => {
      dispatch(deleteShape(shapeKey))
      dispatch(closeContextMenu());
      document.removeEventListener('keydown', onKeyDown);
    };
    const onKeyDown = event => {
      const key = event.key.toLowerCase();

      switch (key) {
        case 'w':
          toggleWinding();
          break;
        case 'r':
          reverseWinding();
          break;
        case 'a':
          selectShapeVertices(shapeKey);
          break;
        case 's':
          selectShapeVertices(shapeKey, true);
          break;
        case 'd':
          removeShape();
          break;
      }

      document.removeEventListener('keydown', onKeyDown);
    };

    document.addEventListener('keydown', onKeyDown);
    return (
      <List>
        <li>
          <ContextButton onClick={toggleWinding}>
            {shape.showWinding ? 'hide [w]inding' : 'show [w]inding'}
          </ContextButton>
        </li>
        <li>
          <ContextButton onClick={reverseWinding}>[r]everse winding</ContextButton>
        </li>
        <li>
          <ContextButton onClick={() => selectShapeVertices(shapeKey)}>select shape verts ([a]dd)</ContextButton>
        </li>
        <li>
          <ContextButton onClick={() => selectShapeVertices(shapeKey, true)}>select shape verts ([s]et)</ContextButton>
        </li>
        <li>
          <ContextButton onClick={removeShape}>[d]elete shape</ContextButton>
        </li>
      </List>
    );
  }
);

const getMenuContents = (type, options) => {
  switch (type) {
    case SHAPE:
      return (
        <ShapeContextMenu
          shape={options.shape}
          shapeKey={options.shapeKey}
        />
      );
    default:
      return null;
  }
};

const ContextMenu = ({
  type,
  rootContainer,
  dispatch,
  x,
  y,
  options,
}) => {
  const open = !!type;
  const modalRef = useRef();

  useEffect(() => {
    const close = event => {
      const modal = modalRef.current;
      let doClose = false;

      const { type: eventType, target, key } = event;
      switch (eventType) {
        case 'keydown':
          if (key === 'Escape' || key === 'Esc') {
            doClose = true;
          }
          break;
        case 'pointerdown':
          if (target !== modal && !modal?.contains(target) && event.button !== 2) {
            doClose = true;
          }
          break;
        default:
          break;
      }

      if (doClose) {
        dispatch(closeContextMenu());
        document.removeEventListener('keydown', close);
        document.removeEventListener('pointerdown', close);
      }
    };

    if (open) {
      document.addEventListener('keydown', close);
      document.addEventListener('pointerdown', close);
    }

    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    };
  }, [dispatch, open]);

  return (
    rootContainer && open ?
      createPortal(
        <Modal
          left={x}
          top={y}
          ref={modalRef}
        >
          <Header>{type.toLowerCase()} options</Header>
          {getMenuContents(type, options)}
        </Modal>,
        rootContainer,
      ) :
      null
  );
};

export default withSelector(RootContext, selector)(ContextMenu)
