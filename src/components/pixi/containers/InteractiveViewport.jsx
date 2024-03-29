// src/components/pixi/containers/InteractiveViewport.jsx
import React, { useEffect, useState } from 'react';

import { scaleUI } from 'Actions/actions';
import { clearKeys, pressKey, releaseKey } from 'Actions/modifier-keys-actions';
import { setViewportCenter } from 'Reducers/viewport-reducer';
import withSelector from 'Components/hoc/withSelector';
import withSelectOverlay from 'Components/pixi/hoc/withSelectOverlay';
import InteractiveViewport from 'Components/pixi/InteractiveViewport';
import ScreenContext from 'Contexts/ScreenContext';
/**
 * Strictly compares all arguments
 * @TODO move to util
 */
const allEqual = (...elements) =>
  elements.reduce(
    (areEqual, element, index) =>
      areEqual && element === elements[(index + 1) % elements.length],
    true
  );

const selector = ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  panModifierCode,
}) => ({
  dispatch,
  backgroundColor,
  mode,
  tool,
  panModifierCode,
});

const Container = (props) => {
  const { dispatch, overlayRef, screenHeight, screenWidth } = props;
  const [viewportBackgroundProps, setViewportBackgroundProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [backgroundPropsSet, setBackgroundPropsSet] = useState(false);
  const [viewportCenterSet, setViewportCenterSet] = useState(false);

  // Monitor changes in screen size to resize the background
  useEffect(() => {
    if (overlayRef.current) {
      const { top, bottom, left, right } = overlayRef.current;
      setViewportBackgroundProps((currentViewportBackgroundProps) => ({
        ...currentViewportBackgroundProps,
        ...{
          x: left,
          y: top,
          width: right - left,
          height: bottom - top,
        },
      }));
    }
  }, [screenHeight, screenWidth, overlayRef]);

  // attach key down and up handlers to document.
  // @TODO check focus to see if it's inside this app.
  useEffect(() => {
    const onKeyDown = ({ code }) => dispatch(pressKey(code));
    const onKeyUp = ({ code }) => dispatch(releaseKey(code));

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [dispatch]);

  useEffect(() => {
    const onBlur = () => {
      dispatch(clearKeys());
    };

    const onFocus = () => {
      dispatch(clearKeys());
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [dispatch]);

  /**
   * Sets the initial background dimensions and initial viewport center
   */
  const onFrameEnd = (viewport) => {
    const { top, bottom, left, right } = viewport;
    if (!viewportCenterSet && !allEqual(viewport.x, viewport.center.y, 0)) {
      dispatch(setViewportCenter(viewport.center));
      setViewportCenterSet(true);
    }

    if (
      !backgroundPropsSet &&
      !allEqual(top, bottom, 0) &&
      !allEqual(left, right, 0)
    ) {
      setViewportBackgroundProps((currentViewportBackgroundProps) => ({
        ...currentViewportBackgroundProps,
        ...{
          x: left,
          y: top,
          width: right - left,
          height: bottom - top,
        },
      }));

      setBackgroundPropsSet(true);
    }
  };

  /**
   * Set's the background dimensions on move
   */
  const onMoved = ({ viewport }) => {
    const { top, bottom, left, right } = viewport;

    setViewportBackgroundProps((currentViewportBackgroundProps) => ({
      ...currentViewportBackgroundProps,
      ...{
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      },
    }));
  };

  /**
   * Set's the background dimensions on move
   */
  const onMovedEnd = (viewport) => {
    const { top, bottom, left, right } = viewport;

    dispatch(setViewportCenter(viewport.center));

    setViewportBackgroundProps((currentViewportBackgroundProps) => ({
      ...currentViewportBackgroundProps,
      ...{
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      },
    }));
  };

  const onZoomed = ({
    viewport: {
      scale: { x, y },
    },
  }) => dispatch(scaleUI({ x, y }));

  return (
    <InteractiveViewport
      {...props}
      onframeend={onFrameEnd}
      onmoved={onMoved}
      onmovedend={onMovedEnd}
      onzoomed={onZoomed}
      viewportBackgroundProps={viewportBackgroundProps}
    />
  );
};

export default withSelector(
  ScreenContext,
  selector
)(withSelectOverlay(Container));
