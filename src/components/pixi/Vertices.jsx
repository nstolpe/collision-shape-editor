// components/pixi/Vertices.js
import React, { useCallback, useState } from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber';

import {
  addVertex,
  deleteVertex,
  moveVertex,
  startMoveVertex,
  stopMoveVertex,
} from 'actions/actions';

import Vertex from 'components/pixi/Vertex';
import { useScreenContext } from 'contexts/ScreenContext';

const Vertices = ({ active, width, height, scale, setCursor }, oldProps) => {
  const {
    altPressed,
    ctrlPressed,
    dispatch,
    vertices,
  } = useScreenContext();
  const [movingVertices, setMovingVertices] = useState([]);
  const hitArea = new PIXI.Rectangle(0, 0, width, height);

  const handlePointerMove = event => {
    const vertexByIdentifier = vertex => vertex.identifier === event.data.identifier;

    if (movingVertices.length ) {
      const vertex = movingVertices.find(vertexByIdentifier);

      if (vertex) {
        const coordinates = event.data.getLocalPosition(event.currentTarget);
        const { id } = vertex;
        dispatch(moveVertex({ ...coordinates, id }))
      }
    }
  };

  return(
    <Container
      name='Vertices'
      hitArea={hitArea}
      interactive={active}
      pointermove={handlePointerMove}
      pointertap={e => {
        const coordinates = e.data.getLocalPosition(e.currentTarget);
        dispatch(addVertex(coordinates));
      }}
    >
      {vertices.map((vertex, idx) => {
        const { x, y, id } = vertex;
        const props = {
          active,
          altPressed,
          ctrlPressed,
          id,
          scale: [
            1 / scale.x,
            1 / scale.y,
          ],
          setMovingVertices,
          setCursor,
          movingVertices,
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
