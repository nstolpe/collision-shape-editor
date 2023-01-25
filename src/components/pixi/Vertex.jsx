// components/pixi/Vertex.js
import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import restComparator from 'Comparators/rest';
import scaleComparator from 'Comparators/scale';
import Circle from 'Components/pixi/base/Circle';
import * as Cursors from 'Constants/cursors';
import * as Tools from 'Constants/tools';

import { draw as drawCircle } from 'Components/pixi/base/Circle';

export const getCursor = (tool) => {
  switch (tool) {
    case Tools.ADD:
      return Cursors.CELL;
    case Tools.DELETE:
      return Cursors.NOT_ALLOWED;
    case Tools.SELECT:
      return Cursors.MOVE;
    default:
      return Cursors.DEFAULT;
  }
};

class Vertex extends React.Component {
  state = {
    shouldReCache: true,
  };

  draw = (instance, oldProps, newProps) => {
    const [oldPropsRest, newPropsRest] = drawCircle(
      instance,
      oldProps,
      newProps
    );
    const { shouldReCache } = this.state;

    if (shouldReCache) {
      this.setState({ shouldReCache: false });
    }

    return [oldPropsRest, newPropsRest];
  };

  componentDidUpdate(prevProps) {
    const { selected: oldSelected } = prevProps;
    const { selected } = this.props;

    if (selected !== oldSelected) {
      this.setState({ shouldReCache: true });
    }
  }

  render() {
    const {
      activeFill,
      alpha,
      fill,
      hitArea,
      id,
      radius,
      scale,
      selected,
      strokeAlignment,
      strokeColor,
      strokeWidth,
      tool,
      x,
      y,
      innerRef,
    } = this.props;
    const { shouldReCache } = this.state;
    return (
      <Circle
        alpha={alpha}
        buttonMode
        cursor={getCursor(tool)}
        fill={selected ? activeFill : fill}
        draw={this.draw}
        hitArea={hitArea}
        interactive={true}
        name={id}
        pivot={{ x: 0, y: 0 }}
        radius={radius}
        ref={innerRef}
        scale={scale}
        x={x}
        y={y}
        strokeAlignment={strokeAlignment}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        zIndex={selected ? 10 : 0}
        cacheAsBitmap={shouldReCache}
        cacheAsBitmapResolution={2}
      />
    );
  }
}

Vertex.defaultProps = {
  activeFill: 0x17bafb,
  alpha: 1,
  fill: 0xe62bdc,
  hitArea: new PIXI.Circle(0, 0, 5.5),
  id: 'ID',
  radius: 6.5,
  scale: [1, 1],
  selected: false,
  // @TODO disable/remove this prop, so the radius is never changed by stroke.
  strokeAlignment: 0,
  strokeColor: 0xffffff,
  strokeWidth: 2,
  tool: Tools.SELECT,
  x: 0,
  y: 0,
};

Vertex.propTypes = {
  activeFill: PropTypes.number,
  alpha: PropTypes.number,
  fill: PropTypes.number,
  hitArea: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  radius: PropTypes.number,
  scale: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  selected: PropTypes.bool,
  strokeAlignment: PropTypes.number,
  strokeColor: PropTypes.number,
  strokeWidth: PropTypes.number,
  tool: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
};

const comparator = (
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

// export default React.memo(Vertex, comparator);

export default React.memo(
  React.forwardRef((props, ref) => <Vertex innerRef={ref} {...props} />),
  comparator
);

// export default React.forwardRef((props, ref) => (
//   <Vertex innerRef={ref} {...props} />
// ));
