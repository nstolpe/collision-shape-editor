import PropTypes from 'prop-types';
import React from 'react';

import withSelector from 'Components/hoc/withSelector';
import Edge from 'Components/pixi/Edge';

import ScreenContext from 'Contexts/ScreenContext';

import restComparator from 'Comparators/rest';

import { withinAABB } from 'Utility/math';

const containerSelector = ({
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

const updateOverlaySelector = ({
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
}) => ({
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
});

class Container extends React.Component {
  state = {
    isWithinOverlayBounds: false,
  };

  componentDidUpdate(prevProps) {
    const { selectOverlayEnabled } = this.props;

    if (selectOverlayEnabled) {
      if (
        !restComparator(
          updateOverlaySelector(prevProps),
          updateOverlaySelector(this.props)
        )
      ) {
        const {
          x1,
          y1,
          x2,
          y2,
          selectOverlayX,
          selectOverlayY,
          selectOverlayWidth,
          selectOverlayHeight,
          radius,
        } = this.props;
        const isWithinOverlayBounds =
          withinAABB(
            { x: x1, y: y1 },
            { x: selectOverlayX, y: selectOverlayY },
            {
              x: selectOverlayX + selectOverlayWidth,
              y: selectOverlayY + selectOverlayHeight,
            },
            radius
          ) &&
          withinAABB(
            { x: x2, y: y2 },
            { x: selectOverlayX, y: selectOverlayY },
            {
              x: selectOverlayX + selectOverlayWidth,
              y: selectOverlayY + selectOverlayHeight,
            },
            radius
          );

        this.setState({ isWithinOverlayBounds });
      }
    }
  }

  render() {
    const { id, length, rotation, scale, selected, tool, x1, y1 } = this.props;
    const { isWithinOverlayBounds } = this.state;
    return (
      <Edge
        id={id}
        length={length}
        rotation={rotation}
        scale={scale}
        selected={selected || isWithinOverlayBounds}
        tool={tool}
        x={x1}
        y={y1}
      />
    );
  }
}

Container.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  length: PropTypes.number,
  radius: PropTypes.number,
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
  tool: PropTypes.string,
  selectOverlayEnabled: PropTypes.bool,
  selectOverlayX: PropTypes.number,
  selectOverlayY: PropTypes.number,
  selectOverlayWidth: PropTypes.number,
  selectOverlayHeight: PropTypes.number,
};

export default withSelector(ScreenContext, containerSelector)(Container);
