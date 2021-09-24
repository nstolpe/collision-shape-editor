// components/pixi/Geometry.jsx
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import withSelector from 'components/hoc/withSelector';
import ConnectedEdge from 'components/pixi/ConnectedEdge';
import ConnectedVertex from 'components/pixi/ConnectedVertex';
import { EDGE, VERTEX } from 'constants/prefixes';
import { SELECT } from 'constants/tools';
import ScreenContext from 'contexts/ScreenContext';
import { addPrefix } from 'tools/prefix';

const selector = ({ tool }) => ({ tool });

const Geometry = ({
  scale,
  selectedVertices,
  tool,
  vertices,
}) => {
  const [inverseScale, setInverseScale] = useState([
    1 / scale.x,
    1 / scale.y,
  ]);

  useEffect(() => {
    setInverseScale([1 / scale.x, 1 / scale.y])
  }, [scale.x, scale.y]);

  return Array.from(vertices.entries()).reduce((result, [vertex1Index, vertex1Key, vertex1]) => {
    const vertex1Id = addPrefix(vertex1Key, VERTEX);
    const vertex2Index = (vertex1Index + 1) % vertices.length;
    /* @TODO handle open/closed polygon here */
    const vertex2 = vertices.index(vertex2Index);
    const vertex2Key = vertices.keys[vertex2Index];
    const vertex2Id = addPrefix(vertex2Key, VERTEX);

    const edgeId = addPrefix(`${vertex1Key}__${vertex2Key}`, EDGE);

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
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    };

    result[0].push(<ConnectedEdge { ...edgeProps } />);
    result[1].push(<ConnectedVertex { ...vertexProps } />);

    return result;
  }, [[], []])
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
};

Geometry.defaultProps = {
  scale: { x: 1, y: 1 },
  selectedVertices: {},
  tool: SELECT,
  vertices: [],
};

export default withSelector(ScreenContext, selector)(Geometry);
