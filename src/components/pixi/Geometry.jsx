// components/pixi/pixi/Geometry.js
import PropTypes from 'prop-types';
import React, {
  useEffect,
  useState,
} from 'react';

import withSelector from 'components/hoc/withSelector';
import Edge from 'components/pixi/Edge';
import Vertex from 'components/pixi/Vertex';
import { EDGE, VERTEX } from 'constants/prefixes';
import { SELECT } from 'constants/tools';
import ScreenContext from 'contexts/ScreenContext';
import { addPrefix } from 'tools/prefix';

const selector = ({ tool }) => ({ tool });

const Vertices = ({
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

  return vertices.reduce((result, vertex1, idx) => {
    const { x, y, id } = vertex1;
    const vertex2 = vertices[(idx + 1) % vertices.length];
    const vertexId = addPrefix(id, VERTEX);
    const edgeId = addPrefix(`${vertex1.id}__${vertex2.id}`, EDGE);
    const dx = (vertex2.x - vertex1.x) * scale.x;
    const dy = (vertex2.y - vertex1.y) * scale.y;

    const vertexProps = {
      id: vertexId,
      key: vertexId,
      scale: inverseScale,
      selected: selectedVertices.hasOwnProperty(vertexId),
      tool,
      x,
      y,
    };

    const edgeProps = {
      id: edgeId,
      key: edgeId,
      length: Math.sqrt(dx ** 2 + dy ** 2), //Math.hypot(dx, dy),
      rotation: Math.atan2(dy, dx),
      scale: inverseScale,
      selected: selectedVertices.hasOwnProperty(vertexId) && selectedVertices.hasOwnProperty(addPrefix(vertex2.id, VERTEX)),
      x: vertex1.x,
      y: vertex1.y,
    };
    if (edgeProps.length > 1555) {
      console.log(edgeProps.length, edgeId, idx);
    }

    result[0].push(<Edge { ...edgeProps } />);
    result[1].push(<Vertex { ...vertexProps } />);

    return result;
  }, [[], []]);
};

Vertices.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  selectedVertices: PropTypes.objectOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  })),
  vertices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    x: PropTypes.number,
    y: PropTypes.number,
  })),
};

Vertices.defaultProps = {
  scale: { x: 1, y: 1 },
  selectedVertices: {},
  tool: SELECT,
  vertices: [],
};

export default withSelector(ScreenContext, selector)(Vertices);
