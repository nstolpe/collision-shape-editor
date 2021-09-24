// components/pixi/ConnectedEdge.jsx
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import withSelector from 'components/hoc/withSelector';
import Edge from 'components/pixi/Edge';
import ScreenContext from 'contexts/ScreenContext';
import { withinAABB } from 'tools/math';

const selector = ({
  uiOptions: {
    vertexRadius: radius,
  },
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

const ConnectedEdge = ({
  id,
  length,
  rotation,
  scale,
  selected,
  x1,
  y1,
  x2,
  y2,
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
      setIsWithinOverlayBounds(withinAABB(
        { x: x1, y: y1 },
        { x: selectOverlayX, y: selectOverlayY },
        {
          x: selectOverlayX + selectOverlayWidth,
          y: selectOverlayY + selectOverlayHeight,
        },
        radius
      ) && withinAABB(
        { x: x2, y: y2 },
        { x: selectOverlayX, y: selectOverlayY },
        {
          x: selectOverlayX + selectOverlayWidth,
          y: selectOverlayY + selectOverlayHeight,
        },
        radius
      ));
    } else {
      setIsWithinOverlayBounds(false);
    }
  }, [
    x1,
    y1,
    x2,
    y2,
    selectOverlayEnabled,
    selectOverlayX,
    selectOverlayY,
    selectOverlayWidth,
    selectOverlayHeight,
    radius,
  ]);

  return (
    <Edge
      ref={ref}
      id={id}
      length={length}
      rotation={rotation}
      scale={scale}
      selected={selected || isWithinOverlayBounds}
      x={x1}
      y={y1}
    />
  );
};

ConnectedEdge.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  length: PropTypes.number,
  rotation: PropTypes.number,
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  selected: PropTypes.bool,
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  selectOverlayEnabled: PropTypes.bool,
  selectOverlayX: PropTypes.number,
  selectOverlayY: PropTypes.number,
  selectOverlayWidth: PropTypes.number,
  selectOverlayHeight: PropTypes.number,
};

export default withSelector(ScreenContext, selector)(ConnectedEdge);
