// src/components/html/ShapeContextMenu.jsx
import React from 'react';
import styled from '@emotion/styled';

import { Button, Ul } from 'Components/html/resets';
import withContextMenu from 'Components/html/hoc/withContextMenu';

const Header = styled.h3`
  color: hsl(0, 0%, 75%);
  font-size: 1.25em;
  font-weight: bold;
  line-height: 1.2;
  background-color: hsl(0, 0%, 25%);
  margin: 0 0 0.4em;
  pointer-events: none;
  text-align: center;
  border-radius: 0.4rem 0.4rem 0 0;
  padding: 0 0.8rem;
`;

const MenuButton = styled(Button)`
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

const ShapeContextMenu = ({
  shape,
  shapeKey,
  dispatch,
  toggleWinding,
  reverseWinding,
  selectShapeVertices,
  removeShape,
}) => {
  const onToggleWinding = (shapeKey) => {
    toggleWinding(shapeKey);
    document.removeEventListener('keydown', onKeyDown);
  };
  const onReverseWinding = (shapeKey) => {
    reverseWinding(shapeKey);
    document.removeEventListener('keydown', onKeyDown);
  };
  const onSelectShapeVertices = (shape, shapeKey, replace = false) => {
    selectShapeVertices(shape, shapeKey, replace);
    document.removeEventListener('keydown', onKeyDown);
  };
  const onRemoveShape = (shapeKey) => {
    removeShape(shapeKey);
    document.removeEventListener('keydown', onKeyDown);
  };
  const onKeyDown = (event) => {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'w':
        onToggleWinding(shapeKey);
        break;
      case 'r':
        onReverseWinding(shapeKey);
        break;
      case 'a':
        onSelectShapeVertices(shape, shapeKey);
        break;
      case 's':
        onSelectShapeVertices(shape, shapeKey, true);
        break;
      case 'd':
        onRemoveShape(shapeKey);
        break;
    }

    document.removeEventListener('keydown', onKeyDown);
  };

  document.addEventListener('keydown', onKeyDown);

  return (
    <>
      <Header>shape options</Header>
      <List>
        <li>
          <MenuButton onClick={() => onToggleWinding(shapeKey)}>
            {shape.showWinding ? 'hide [w]inding' : 'show [w]inding'}
          </MenuButton>
        </li>
        <li>
          <MenuButton onClick={() => onReverseWinding(shapeKey)}>
            [r]everse winding
          </MenuButton>
        </li>
        <li>
          <MenuButton onClick={() => onSelectShapeVertices(shape, shapeKey)}>
            select shape verts ([a]dd)
          </MenuButton>
        </li>
        <li>
          <MenuButton
            onClick={() => onSelectShapeVertices(shape, shapeKey, true)}
          >
            select shape verts ([s]et)
          </MenuButton>
        </li>
        <li>
          <MenuButton onClick={() => removeShape(shapeKey)}>
            [d]elete shape
          </MenuButton>
        </li>
      </List>
    </>
  );
};

export default withContextMenu(ShapeContextMenu);
