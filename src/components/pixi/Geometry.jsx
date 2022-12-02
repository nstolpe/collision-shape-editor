// components/pixi/Geometry.jsx
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container, Text } from 'react-pixi-fiber/index.js';
import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

import restComparator from 'Comparators/rest';
import scaleComparator from 'Comparators/scale';
import withSelector from 'Components/hoc/withSelector';
import Edge from 'Components/pixi/containers/Edge';
import Vertex from 'Components/pixi/containers/Vertex';
import { EDGE, SHAPE, VERTEX } from 'Constants/prefixes';
import { SELECT } from 'Constants/tools';
import ScreenContext from 'Contexts/ScreenContext';
import { addPrefix, removePrefix, DEFAULT_DELIMITER } from 'Utility/prefix';
window.chroma = chroma;
const selector = ({ backgroundColor, scale, tool }) => ({
  backgroundColor,
  scale,
  tool,
});

const comparator = (
  { scale, ...restProps },
  { scale: oldScale, ...oldRestProps }
) => {
  if (!scaleComparator(scale, oldScale)) {
    return false;
  }

  if (!restComparator(restProps, oldRestProps)) {
    return false;
  }

  return true;
};

// @TODO these keep rendering over and over again. make that stop
const Geometry = ({
  backgroundColor,
  selectedVertices,
  vertices,
  closed,
  showWinding,
  tool,
  scale,
  name,
}) => {
  const inverseScale = useMemo(
    () => ({
      x: 1 / scale.x,
      y: 1 / scale.y,
    }),
    [scale.x, scale.y]
  );

  const containerRef = useCallback((container) => {
    if (container) {
      const { height, width, x, y } = container.getBounds();

      container.pivot.set(x + width / 2, y + height / 2);
      container.position.set(x + width / 2, y + height / 2);
    }
  }, []);

  // const hitArea = useMemo(() => new PIXI.Polygon(vertices.values), [vertices]);

  const components = Array.from(vertices.entries()).reduce(
    (result, [vertex1Index, vertex1Key, vertex1]) => {
      const vertex1Id = `${addPrefix(
        VERTEX,
        vertex1Key
      )}${DEFAULT_DELIMITER}${name}`;
      const { x: x1, y: y1 } = vertex1;
      const vertexProps = {
        id: vertex1Id,
        key: vertex1Id,
        scale: inverseScale,
        selected: selectedVertices.hasOwnProperty(vertex1Id),
        tool,
        x: x1,
        y: y1,
      };

      // draw the final edge if the geometry is closed.
      if (closed || vertex1Index !== vertices.length - 1) {
        const vertex2Index = (vertex1Index + 1) % vertices.length;
        const vertex2 = vertices.index(vertex2Index);
        const vertex2Key = vertices.keys[vertex2Index];
        const vertex2Id = `${addPrefix(
          VERTEX,
          vertex2Key
        )}${DEFAULT_DELIMITER}${name}`;
        const edgeId = addPrefix(
          EDGE,
          `${vertex1Key}${DEFAULT_DELIMITER}${vertex2Key}${DEFAULT_DELIMITER}${name}`
        );
        const { x: x2, y: y2 } = vertex2;
        const dx = (x2 - x1) * scale.x;
        const dy = (y2 - y1) * scale.y;
        const edgeProps = {
          id: edgeId,
          key: edgeId,
          length: Math.hypot(dx, dy), //Math.sqrt(dx ** 2 + dy ** 2),
          rotation: Math.atan2(dy, dx),
          scale: inverseScale,
          selected:
            selectedVertices.hasOwnProperty(vertex1Id) &&
            selectedVertices.hasOwnProperty(vertex2Id),
          tool,
          x1,
          y1,
          x2,
          y2,
        };

        result[0].push(<Edge {...edgeProps} />);
      }

      result[1].push(<Vertex {...vertexProps} />);

      if (showWinding) {
        const [r, g, b] = chroma(
          backgroundColor.toString(16).padStart(6, 0)
        ).rgb();
        const inverseHex = chroma({ r: 255 - r, g: 255 - g, b: 255 - b }).hex();

        result[2].push(
          <Text
            key={addPrefix('VERTEX_INDEX', vertex1Key)}
            text={vertex1Index}
            x={x1}
            y={y1}
            style={{
              fontFamily: 'Fira Mono',
              fontSize: '2rem',
              fill: inverseHex,
              padding: 4,
            }}
            scale={inverseScale}
          />
        );
      }

      return result;
    },
    showWinding ? [[], [], []] : [[], []]
  );

  return (
    <Container
      name={name}
      ref={containerRef}
      interactive
      // hitArea={hitArea}
    >
      {components}
    </Container>
  );
};

Geometry.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  selectedVertices: PropTypes.objectOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })
  ),
  vertices: PropTypes.objectOf(
    PropTypes.shape({
      // this should go
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      x: PropTypes.number,
      y: PropTypes.number,
    })
  ),
  closed: PropTypes.bool,
};

Geometry.defaultProps = {
  scale: { x: 1, y: 1 },
  selectedVertices: {},
  tool: SELECT,
  vertices: [],
  closed: true,
};

export default withSelector(ScreenContext, selector, comparator)(Geometry);
