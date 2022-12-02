// components/pixi/ConnectedVertex.jsx
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import withSelector from 'Components/hoc/withSelector';
import Vertex from 'Components/pixi/Vertex';
import ScreenContext from 'Contexts/ScreenContext';
import { withinAABB } from 'Utility/math';

const selector = ({
  uiOptions: { vertexRadius: radius },
  selectOverlay: {
    enabled: selectOverlayEnabled,
    x: selectOverlayX,
    y: selectOverlayY,
    width: selectOverlayWidth,
    height: selectOverlayHeight,
  },
}) => ({
  radius,
  selectOverlayEnabled,
  selectOverlayX,
  selectOverlayY,
  selectOverlayWidth,
  selectOverlayHeight,
});

const ConnectedVertex = ({
  id,
  scale,
  selected,
  tool,
  x,
  y,
  radius,
  selectOverlayEnabled,
  selectOverlayX,
  selectOverlayY,
  selectOverlayWidth,
  selectOverlayHeight,
}) => {
  const ref = useRef();
  const [isWithinOverlayBounds, setIsWithinOverlayBounds] = useState(false);

  useEffect(() => {
    if (selectOverlayEnabled && ref.current) {
      setIsWithinOverlayBounds(
        withinAABB(
          { x, y },
          { x: selectOverlayX, y: selectOverlayY },
          {
            x: selectOverlayX + selectOverlayWidth,
            y: selectOverlayY + selectOverlayHeight,
          },
          radius
        )
      );
    } else {
      setIsWithinOverlayBounds(false);
    }
  }, [
    x,
    y,
    selectOverlayEnabled,
    selectOverlayX,
    selectOverlayY,
    selectOverlayWidth,
    selectOverlayHeight,
    radius,
  ]);

  return (
    <Vertex
      ref={ref}
      id={id}
      radius={radius}
      scale={scale}
      selected={selected || isWithinOverlayBounds}
      tool={tool}
      x={x}
      y={y}
    />
  );
};

ConnectedVertex.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  selected: PropTypes.bool,
  tool: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  radius: PropTypes.number,
  selectOverlayEnabled: PropTypes.bool,
  selectOverlayX: PropTypes.number,
  selectOverlayY: PropTypes.number,
  selectOverlayWidth: PropTypes.number,
  selectOverlayHeight: PropTypes.number,
};

export default withSelector(ScreenContext, selector)(ConnectedVertex);
