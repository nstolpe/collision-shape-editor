// src/components/pixi/Edge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Rectangle from 'Components/pixi/base/Rectangle';
import * as Cursors from 'Constants/cursors';
import * as Tools from 'Constants/tools';

import { draw as drawRectangle } from 'Components/pixi/base/Rectangle';

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

class Edge extends React.Component {
  static paddingWidth = 2;

  state = {
    pivot: { x: 0, y: 0 },
    hitArea: null,
    shouldReCache: false,
  };

  // Custom draw method to allow setting this.state.shouldReCache after
  // the draw (after it's been cached or not cached).
  draw = (instance, oldProps, newProps) => {
    const [oldPropsRest, newPropsRest] = drawRectangle(
      instance,
      oldProps,
      newProps
    );
    const { shouldReCache } = this.state;
    // console.log('foobar');

    if (shouldReCache) {
      this.setState({ shouldReCache: false });
    }

    // this.setState({ shouldReCache: false });

    return [oldPropsRest, newPropsRest];
  };

  componentDidMount() {
    const { length, thickness } = this.props;
    const pivot = { x: 0, y: thickness * 0.5 };
    const hitArea = new PIXI.Rectangle(
      0,
      -Edge.paddingWidth,
      length,
      thickness + Edge.paddingWidth * 2
    );

    this.setState({
      hitArea,
      pivot,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      thickness: oldThickness,
      length: oldLength,
      selected: oldSelected,
    } = prevProps;
    const { thickness, length, selected } = this.props;

    if (oldThickness !== thickness || oldLength !== length) {
      this.setState({
        hitArea: new PIXI.Rectangle(
          0,
          -Edge.paddingWidth,
          length,
          thickness + Edge.paddingWidth * 2
        ),
        shouldReCache: true,
      });
    } else if (selected !== oldSelected) {
      this.setState({ shouldReCache: true });
    }

    if (thickness !== this.props.thickness) {
      this.setState({ pivot: { x: 0, y: thickness * 0.5 } });
    }
  }

  render() {
    const {
      activeFill,
      fill,
      id,
      length,
      rotation,
      scale,
      selected,
      thickness,
      tool,
      x,
      y,
      innerRef,
    } = this.props;
    const { pivot, hitArea, shouldReCache } = this.state;
    return (
      <Rectangle
        cursor={getCursor(tool)}
        fill={selected ? activeFill : fill}
        height={thickness}
        hitArea={hitArea}
        interactive
        name={id}
        pivot={pivot}
        ref={innerRef}
        rotation={rotation}
        scale={scale}
        width={length}
        draw={this.draw}
        x={x}
        y={y}
        cacheAsBitmap={shouldReCache}
        cacheAsBitmapResolution={2}
      />
    );
  }
}

Edge.propTypes = {
  activeFill: PropTypes.number,
  fill: PropTypes.number,
  length: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  thickness: PropTypes.number,
  tool: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  innerRef: PropTypes.object,
};

Edge.defaultProps = {
  activeFill: 0x17bafb,
  fill: 0xff3e82,
  selected: false,
  thickness: 1,
  tool: Cursors.DEFAULT,
};

export default React.forwardRef((props, ref) => (
  <Edge innerRef={ref} {...props} />
));
