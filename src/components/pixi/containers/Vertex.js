import PropTypes from 'prop-types';
import React from 'react';

import withSelector from 'Components/hoc/withSelector';
import Vertex from 'Components/pixi/Vertex';

import ScreenContext from 'Contexts/ScreenContext';

import restComparator from 'Comparators/rest';
import scaleComparator from 'Comparators/scale';

import { withinAABB } from 'Utility/math';

const containerSelector = (ctx) => {
  const {
    uiOptions: { vertexRadius: radius },
    selectOverlay: {
      enabled: selectOverlayEnabled,
      x: selectOverlayX,
      y: selectOverlayY,
      width: selectOverlayWidth,
      height: selectOverlayHeight,
    },
  } = ctx;

  return {
    radius,
    selectOverlayEnabled,
    selectOverlayX,
    selectOverlayY,
    selectOverlayWidth,
    selectOverlayHeight,
  };
};

// Maybe use this (or a better version of this) after figuring out why this component
// needs to memoize the vertex to stop rerenders when Edge doesn't
const containerComparator = (
  { scale, ...restProps },
  { scale: oldScale, ...restOldProps }
) => {
  // @TODO maybe scale can be required to conform to { x. y }, and drop array ans scalar.
  const scaleX = scale?.x ?? scale?.[0] ?? scale;
  const scaleY = scale?.y ?? scale?.[1] ?? scale;
  const oldScaleX = oldScale?.x ?? oldScale?.[0] ?? oldScale;
  const oldScaleY = oldScale?.y ?? oldScale?.[1] ?? oldScale;

  if (
    !scaleComparator({ x: scaleX, y: scaleY }, { x: oldScaleX, y: oldScaleY })
  ) {
    return false;
  }

  if (!restComparator(restProps, restOldProps)) {
    return false;
  }

  return true;
};

const memoComparitor = (
  { scale, ...restProps },
  { scale: oldScale, ...restOldProps }
) => {
  // @TODO maybe scale can be required to conform to { x. y }, and drop array ans scalar.
  const scaleX = scale?.x ?? scale?.[0] ?? scale;
  const scaleY = scale?.y ?? scale?.[1] ?? scale;
  const oldScaleX = oldScale?.x ?? oldScale?.[0] ?? oldScale;
  const oldScaleY = oldScale?.y ?? oldScale?.[1] ?? oldScale;

  //
  return (
    scaleComparator({ x: scaleX, y: scaleY }, { x: oldScaleX, y: oldScaleY }) &&
    restComparator(restProps, restOldProps) &&
    true
  );
};

const MemoizedVertex = React.memo(Vertex, memoComparitor);

const shouldUpdateOverlaySelector = ({
  x,
  y,
  selectOverlayEnabled,
  selectOverlayX,
  selectOverlayY,
  selectOverlayWidth,
  selectOverlayHeight,
  radius,
}) => ({
  x,
  y,
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
    const { isWithinOverlayBounds } = this.state;
    if (selectOverlayEnabled) {
      if (
        !restComparator(
          shouldUpdateOverlaySelector(prevProps),
          shouldUpdateOverlaySelector(this.props)
        )
      ) {
        const {
          x,
          y,
          radius,
          selectOverlayX,
          selectOverlayY,
          selectOverlayWidth,
          selectOverlayHeight,
        } = this.props;
        const isWithinOverlayBounds = withinAABB(
          { x, y },
          { x: selectOverlayX, y: selectOverlayY },
          {
            x: selectOverlayX + selectOverlayWidth,
            y: selectOverlayY + selectOverlayHeight,
          },
          radius
        );

        this.setState({ isWithinOverlayBounds });
      }
    } else if (isWithinOverlayBounds === true) {
      this.setState({ isWithinOverlayBounds: false });
    }
  }

  render() {
    const { id, radius, scale, selected, tool, x, y } = this.props;
    const { isWithinOverlayBounds } = this.state;
    return (
      <MemoizedVertex
        id={id}
        radius={radius}
        scale={scale}
        selected={selected || isWithinOverlayBounds}
        tool={tool}
        x={x}
        y={y}
      />
    );
  }
}

Container.propTypes = {
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

export default withSelector(
  ScreenContext,
  containerSelector
  // containerComparator
)(Container);
