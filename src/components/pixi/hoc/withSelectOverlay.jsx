import * as PIXI from 'pixi.js';
import { useContext, useEffect, useRef, useState } from 'react';
 import { usePixiApp } from 'react-pixi-fiber';
import ScreenContext from 'contexts/ScreenContext';
import useCustomCompareMemo from 'hooks/useCustomCompareMemo';
import selectOverlayComparator from 'comparators/select-overlay';
import scaleComparator from 'comparators/scale';
import selectOverlaySelector from 'selectors/select-overlay';
import selectOverlayFragment from 'shaders/select-overlay-fragment.glsl';

const selector = ({
  scale,
  selectOverlay,
}) => ({
  scale,
  ...selectOverlaySelector({ selectOverlay }),
});

const comparator =({
  scale,
  ...selectOverlayProps
}, {
  scale: oldScale,
  ...oldSelectOverlayProps
}) => {
  if (!scaleComparator(scale, oldScale)) {
    return false;
  }

  if (!selectOverlayComparator(selectOverlayProps, oldSelectOverlayProps)) {
    return false;
  }

  return true;
};

const withSelectOverlay = WrappedComponent => props => {
  // @TODO get rid of selector, comparator and contex.
  // make all values from useCustomCompareMemo come as props
  const ctx = selector(useContext(ScreenContext));
  const {
    enabled,
    x,
    y,
    width,
    height,
    scale,
  } = useCustomCompareMemo(ctx, comparator);
  const { ticker } = usePixiApp();
  const [time, setTime] = useState(ticker.lastTime);
  const overlayRef = useRef();

  // @TODO add option to enable/disable, and throttle
  ticker.add(() => setTime(ticker.lastTime));

  useEffect(() => {
    if (overlayRef.current) {
      if (enabled) {

        const filter = new PIXI.Filter(
          undefined,
          selectOverlayFragment,
          {
            // @TODO there
            x1: (x * scale.x) + overlayRef.current.getGlobalPosition().x,
            x2: ((x + width) * scale.x) + overlayRef.current.getGlobalPosition().x,
            y1: (y * scale.y) + overlayRef.current.getGlobalPosition().y,
            y2: ((y + height) * scale.y) + overlayRef.current.getGlobalPosition().y,
             time,
          }
        );

        overlayRef.current.filters = [filter];
      } else {
        overlayRef.current.filters = [];
      }
    }
  }, [
    height,
    width,
    x, y,
    time,
    enabled,
    scale.x,
    scale.y
  ]);

  return <WrappedComponent {...{ ...props, overlayRef }} />;
};

export default withSelectOverlay;
