// components/pixi/Geometry.jsx
import { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

import restComparator from 'comparators/rest';
import scaleComparator from 'comparators/scale';
import withSelector from 'components/hoc/withSelector';
import ConnectedEdge from 'components/pixi/ConnectedEdge';
import ConnectedVertex from 'components/pixi/ConnectedVertex';
import { EDGE, SHAPE, VERTEX } from 'constants/prefixes';
import { SELECT } from 'constants/tools';
import ScreenContext from 'contexts/ScreenContext';
import { addPrefix, removePrefix } from 'tools/prefix';

const selector = ({ scale, tool }) => ({ scale, tool });

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

const Geometry = ({
  selectedVertices,
  vertices,
  closed,
  tool,
  scale,
  name,
}) => {
  const inverseScale = useMemo(() => ({
    x: 1 / scale.x,
    y: 1 / scale.y,
  }), [scale.x, scale.y]);
  const ref = useRef();
  const hitArea = useMemo(() => new PIXI.Polygon(vertices.values), [vertices]);

  const components = Array.from(vertices.entries()).reduce((result, [vertex1Index, vertex1Key, vertex1]) => {
    const shapeKey = removePrefix(name, SHAPE);
    const vertex1Id = addPrefix(addPrefix(vertex1Key, shapeKey), VERTEX);
    const vertex2Index = (vertex1Index + 1) % vertices.length;
    /* @TODO handle open/closed polygon here */
    const vertex2 = vertices.index(vertex2Index);
    const vertex2Key = vertices.keys[vertex2Index];
    const vertex2Id = addPrefix(addPrefix(vertex2Key, shapeKey), VERTEX);

    const edgeId = addPrefix(addPrefix(vertex2Key, vertex1Key), EDGE);

    const { x: x1, y: y1 } = vertex1;
    const { x: x2, y: y2 } = vertex2;

    const dx = (x2 - x1) * scale.x;
    const dy = (y2 - y1) * scale.y;

    const vertexProps = {
      id: vertex1Id,
      key: vertex1Id,
      scale: inverseScale,
      selected: selectedVertices.hasOwnProperty(addPrefix(vertex1Key, VERTEX)),
      tool,
      x: x1,
      y: y1,
    };

    const edgeProps = {
      id: edgeId,
      key: edgeId,
      length: Math.sqrt(dx ** 2 + dy ** 2), //Math.hypot(dx, dy),
      rotation: Math.atan2(dy, dx),
      scale: inverseScale,
      selected: selectedVertices.hasOwnProperty(vertex1Id) && selectedVertices.hasOwnProperty(vertex2Id),
      x1,
      y1,
      x2,
      y2,
    };

    result[0].push(<ConnectedEdge { ...edgeProps } />);
    result[1].push(<ConnectedVertex { ...vertexProps } />);

    return result;
  }, [[], []]);

  return (
    <Container
      name={name}
      ref={ref}
      interactive
      hitArea={hitArea}
      cursor={'copy'}
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
  selectedVertices: PropTypes.objectOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  })),
  vertices: PropTypes.objectOf(PropTypes.shape({
    // this should go
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    x: PropTypes.number,
    y: PropTypes.number,
  })),
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
