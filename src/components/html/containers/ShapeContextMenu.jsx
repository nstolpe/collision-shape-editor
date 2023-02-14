// src/components/html/containers/ShapeContextMenu.jsx
import React from 'react';

import {
  closeContextMenu,
  reverseShapeWinding,
  toggleShapeShowWinding,
  deleteShape,
  setSelectedVertices,
  addSelectedVertices,
} from 'Actions/actions';

import RootContext from 'Contexts/RootContext';
import withSelector from 'Components/hoc/withSelector';
import ShapeContextMenu from 'Components/html/ShapeContextMenu';

const selector = ({
  dispatch,
  rootContainer,
  contextMenu: { type, x, y, options },
}) => ({
  dispatch,
  portalTarget: rootContainer,
  shape: options?.shape,
  shapeKey: options?.shapeKey,
  x,
  y,
  // @TODO have a specific setting for shape context menu instead of type stuff.
  isOpen: type === 'SHAPE',
});

const Container = ({ dispatch, ...props }) => {
  const toggleWinding = (shapeKey) => {
    dispatch(toggleShapeShowWinding(shapeKey));
    dispatch(closeContextMenu());
  };

  const reverseWinding = (shapeKey) => {
    dispatch(reverseShapeWinding(shapeKey));
    dispatch(closeContextMenu());
  };

  const selectShapeVertices = (shape, shapeKey, replace = false) => {
    if (replace) {
      const newSelectedVertices = shape.vertices.reduce(
        (result, { x, y }, _, vertexKey) => {
          result[`VERTEX::${vertexKey}::SHAPE::${shapeKey}`] = { x, y };
          return result;
        },
        {}
      );

      dispatch(setSelectedVertices(newSelectedVertices));
    } else {
      const newSelectedVertices = shape.vertices.reduce(
        (result, { x, y }, _, vertexKey) => {
          result[`VERTEX::${vertexKey}::SHAPE::${shapeKey}`] = { x, y };
          return result;
        },
        {}
      );

      dispatch(addSelectedVertices(newSelectedVertices));
    }

    dispatch(closeContextMenu());
  };

  const removeShape = (shapeKey) => {
    dispatch(deleteShape(shapeKey));
    dispatch(closeContextMenu());
  };

  const close = () => {
    dispatch(closeContextMenu());
  };

  return (
    <ShapeContextMenu
      dispatch={dispatch}
      toggleWinding={toggleWinding}
      reverseWinding={reverseWinding}
      selectShapeVertices={selectShapeVertices}
      removeShape={removeShape}
      close={close}
      {...props}
    />
  );
};

export default withSelector(RootContext, selector)(Container);
