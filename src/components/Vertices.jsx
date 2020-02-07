// components/Vertices.js
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber';

import {
  deleteVertex,
  moveVertex,
  startMoveVertex,
  stopMoveVertex,
} from 'actions/actions';

import Vertex from 'components/Vertex';
import { useScreenContext } from 'contexts/ScreenContext';

const Vertices = ({ scale, setCursor }) => {
  const {
    vertices,
    ctrlPressed,
    altPressed,
  } = useScreenContext();
  const [movingVertices, setMovingVertices] = useState([]);

  return(
    <Container name='Vertices'>
      {vertices.map((vertex, idx) => {
        const { x, y, id } = vertex;
        const props = {
          altPressed,
          id,
          ctrlPressed,
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
};

Vertices.defaultProps = {
  scale: { x: 1, y: 1 },
  setCursor: () => {},
};

export default Vertices;
