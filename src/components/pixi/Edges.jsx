// src/components/pixi/Edges.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber/index.js';

import Edge from 'Components/pixi/Edge';
import ScreenContext from 'Contexts/ScreenContext';
import withSelector from 'Components/hoc/withSelector';

/**
 * Callback for Array.prototype.map that configures edges for each
 * set of vertices. Distances are scaled to counteract the inverse scaling later.
 */
export const calculateScaledEdge = (idx, scale, vertex1, vertices) => {
  const vertex2 = vertices[(idx + 1) % vertices.length];
  const dx = (vertex2.x - vertex1.x) * scale.x;
  const dy = (vertex2.y - vertex1.y) * scale.y;
  const position = [
    (vertex2.x + vertex1.x) * 0.5,
    (vertex2.y + vertex1.y) * 0.5,
  ];

  return {
    length: Math.hypot(dx, dy),
    position,
    rotation: Math.atan2(dy, dx),
    vertex1,
    vertex2,
  };
};

const selector = ({ vertices }) => ({ vertices });

const Edges = ({ scale, setCursor, vertices, ...restProps }) => {
  const edges = vertices.map((vertex1, idx, vertices) => calculateScaledEdge(idx, scale, vertex1, vertices));
  const scaleRatio = [
    1 / scale.x,
    1 / scale.y,
  ];

  return (
    <Container name='Edges' {...restProps}>
      {edges.map((edge, key) => {
        const { vertex1: { x, y } } = edge;
        const props = {
          ...edge,
          key,
          scale: scaleRatio,
          setCursor,
          x,
          y,
        };

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

export default withSelector(ScreenContext, selector)(Edges);
