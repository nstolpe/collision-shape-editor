// components/pixi/Vertices.js
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
import usePointerInteractions from 'hooks/usePointerInteractions';

import Vertex from 'components/pixi/Vertex';
import { useScreenContext } from 'contexts/ScreenContext';

const VERTEX_PREFIX = 'VERTEX__';

const getDistance = (pointA, pointB) => {
    const { x: aX, y: aY } = Array.isArray(pointA) ? { x: pointA[0], y: pointA[1] } :
        typeof pointA === 'object' ? pointA :
        { x:0, y: 0 };
    const { x: bX, y: bY } = Array.isArray(pointB) ? { x: pointB[0], y: pointB[1] } :
        typeof pointB === 'object' ? pointB :
        { x:0, y: 0 };

    return {
      x: aX - bX,
      y: aY - bY,
    };
};

const Vertices = ({
  active,
  height,
  width,
  scale,
  setCursor,
  ...restProps
}) => {
  const {
    altPressed,
    ctrlPressed,
    dispatch,
    tool,
    vertices,
  } = useScreenContext();

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
      {vertices.map((vertex, idx) => {
        const { x, y, id } = vertex;
        const scaleRatio = [
          1 / scale.x,
          1 / scale.y,
        ];
        const props = {
          active,
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

export default Vertices;
