import * as PIXI from 'pixi.js';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withApp } from 'react-pixi-fiber/index.js';

import ScreenContext from 'Contexts/ScreenContext';
import useCustomCompareMemo from 'Hooks/useCustomCompareMemo';
import selectOverlayComparator from 'Comparators/select-overlay';
import scaleComparator from 'Comparators/scale';
import selectOverlaySelector from 'Selectors/select-overlay';
import selectOverlayFragment from 'Shaders/select-overlay-fragment.glsl';

const selector = ({ scale, selectOverlay }) => ({
  scale,
  ...selectOverlaySelector({ selectOverlay }),
});

const comparator = (
  { scale, ...selectOverlayProps },
  { scale: oldScale, ...oldSelectOverlayProps }
) => {
  if (!scaleComparator(scale, oldScale)) {
    return false;
  }

  if (!selectOverlayComparator(selectOverlayProps, oldSelectOverlayProps)) {
    return false;
  }

  return true;
};

const withSelectOverlay = (WrappedComponent) => {
  const WrapperComponent = ({ app, ...props }) => {
    // @TODO get rid of selector, comparator and context.
    // make all values from useCustomCompareMemo come as props
    const ctx = selector(useContext(ScreenContext));
    const { enabled, x, y, width, height, scale } = useCustomCompareMemo(
      ctx,
      comparator
    );
    const { ticker } = app;
    const [time, setTime] = useState(0);
    const overlayRef = useRef();
    const [filters, setFilters] = useState([]);
    // @TODO add option to enable/disable, and throttle.
    // move into own hook. or make class component.
    useEffect(() => {
      const updateTime = (delta) =>
        setTime((currentTime) => currentTime + delta * 8);

      ticker.add(updateTime);

      return () => ticker.remove(updateTime);
    }, [ticker]);

    useEffect(() => {
      if (overlayRef.current) {
        if (enabled) {
          const filter = new PIXI.Filter(undefined, selectOverlayFragment, {
            x1: x * scale.x + overlayRef.current.getGlobalPosition().x,
            x2:
              (x + width) * scale.x + overlayRef.current.getGlobalPosition().x,
            y1: y * scale.y + overlayRef.current.getGlobalPosition().y,
            y2:
              (y + height) * scale.y + overlayRef.current.getGlobalPosition().y,
            time,
          });

          setFilters([filter]);
        } else if (overlayRef.current.filters.length > 0) {
          setFilters([]);
        }
      }
    }, [height, width, x, y, time, enabled, scale.x, scale.y]);

    return <WrappedComponent {...{ ...props, overlayRef, filters }} />;
  };

  WrapperComponent.displayName = `${WrappedComponent.name}WithSelectOverlay`;
  return withApp(WrapperComponent);
};

withSelectOverlay.displayName = 'withSelectOverlay';
export default withSelectOverlay;
