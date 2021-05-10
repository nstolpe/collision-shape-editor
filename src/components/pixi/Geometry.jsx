// components/pixi/pixi/Vertices.js
import React, { useCallback, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber';

import {
  addVertex,
  deleteVertex,
  moveVertex,
  moveVertices,
  startMoveVertex,
  stopMoveVertex,
} from 'actions/actions';
import Tools from 'constants/tools';
import { property } from 'tools/property';
import ScreenContext from 'contexts/ScreenContext';
import usePointerInteractions from 'hooks/usePointerInteractions';
import withSelector from 'components/hoc/withSelector';
import Vertex from 'components/pixi/Vertex';

const VERTEX_PREFIX = 'VERTEX__';

// const mapVertex = ()
const selector = ({
  altPressed,
  ctrlPressed,
  dispatch,
  tool,
  vertices,
}) => ({
  altPressed,
  ctrlPressed,
  dispatch,
  tool,
  vertices,
});

const Vertices = ({
  altPressed,
  ctrlPressed,
  dispatch,
  tool,
  vertices,
  height,
  width,
  scale,
  setCursor,
  ...restProps
}) => {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    selectedVertices,
  } = usePointerInteractions();

  const hitArea = new PIXI.Rectangle(0, 0, width, height);

  return(
    <Container
      name='VERTICES'
      hitArea={hitArea}
      pointerdown={handlePointerDown}
      pointerup={handlePointerUp}
      pointerupoutside={e => console.log('log outside', e)}
      pointermove={handlePointerMove}
      {...restProps}
    >
      {vertices.map(vertex => {
        const { x, y, id } = vertex;
        const scaleRatio = [
          1 / scale.x,
          1 / scale.y,
        ];
        const props = {
          altPressed,
          ctrlPressed,
          id,
          scale: scaleRatio,
          setCursor,
          selectedVertices,
          tool,
          x,
          y,
        };
        return <Vertex key={id} { ...props } />;
      })}
    </Container>
  );
};

Vertices.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  setCursor: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number,
};

Vertices.defaultProps = {
  scale: { x: 1, y: 1 },
  setCursor: () => {},
  height: 0,
  width: 0,
};

export default withSelector(ScreenContext, selector)(Vertices);
