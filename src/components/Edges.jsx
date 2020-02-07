// src/components/Edges.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber';

import Edge from 'components/Edge';
import { useScreenContext } from 'contexts/ScreenContext';

/**
 * Callback for Array.prototype.map that configures edges for each
 * set of vertices.
 */
export const calculateEdge = (vertex1, idx, vertices) => {
  const vertex2 = vertices[(idx + 1) % vertices.length];
  const dx = vertex2.x - vertex1.x;
  const dy = vertex2.y - vertex1.y;

  return {
    vertex1,
    vertex2,
    rotation: Math.atan2(dy, dx),
    length: Math.sqrt((dx * dx) + (dy * dy)),
  };
};

const Edges = ({ scale, setCursor }) => {
  const { vertices } = useScreenContext();
  const edges = vertices.map(calculateEdge);

  return (
    <Container name='Edges'>
      {edges.map((edge, key) => {
        const { vertex1: { x, y } } = edge;
        const props = { ...edge, key, setCursor, x, y };

        return <Edge {...props} />;
      })}
    </Container>
  );
};

Edges.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  setCursor: PropTypes.func,
};

Edges.defaultProps = {
  scale: { x: 1, y: 1 },
  setCursor: () => {},
};

export default Edges;
