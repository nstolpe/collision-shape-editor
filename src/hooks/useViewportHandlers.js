// src/js/hooks/useBackground.js
import { useEffect, useState } from 'react';

/**
 * Strictly compares all arguments
 * @TODO move to util
 */
const allEqual = (...elements) => elements.reduce(
  (areEqual, element, index) => areEqual && element === elements[(index + 1) % elements.length],
  true
);

const useViewportHandlers = (ref, screenHeight, screenWidth) => {
  const [viewportBackgroundProps, setViewportBackgroundProps] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [backgroundPropsSet, setBackgroundPropsSet] = useState(false);

  // Monitor changes in screen size to resize the background
  useEffect(() => {
    if (ref.current) {
      const { top, bottom, left, right } = ref.current;

      setViewportBackgroundProps(
        currentViewportBackgroundProps => ({
            ...currentViewportBackgroundProps,
            ...{
              x: left,
              y: top,
              width: right - left,
              height: bottom - top,
            },
        })
      );
    }
  }, [screenHeight, screenWidth, ref]);

  /**
   * Sets the initial dimensions for the background
   */
  const onFrameEnd = viewport => {
    const { top, bottom, left, right } = viewport;

    if (!backgroundPropsSet && !allEqual(top, bottom, 0) && !allEqual(left, right, 0)) {
      setViewportBackgroundProps(
        currentViewportBackgroundProps => ({
            ...currentViewportBackgroundProps,
            ...{
              x: left,
              y: top,
              width: right - left,
              height: bottom - top,
            },
        })
      );

      setBackgroundPropsSet(true);
    }
  };

  /**
   * Set's the background dimensions on move
   */
  const onMoved = ({ viewport }) => {
    const { top, bottom, left, right } = viewport;

    setViewportBackgroundProps(
      currentViewportBackgroundProps => ({
          ...currentViewportBackgroundProps,
          ...{
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
          },
      })
    );
  };

  /**
   * Set's the background dimensions on move
   */
  const onMovedEnd = viewport => {
    const { top, bottom, left, right } = viewport;

    setViewportBackgroundProps(
      currentViewportBackgroundProps => ({
          ...currentViewportBackgroundProps,
          ...{
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
          },
      })
    );
  };

  const onZoomed = ({ viewport }) => {
    const { top, bottom, left, right } = viewport;

    setViewportBackgroundProps(
      currentViewportBackgroundProps => ({
          ...currentViewportBackgroundProps,
          ...{
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
          },
      })
    );
  };

  return {
    onFrameEnd,
    onMoved,
    onMovedEnd,
    onZoomed,
    viewportBackgroundProps,
    setViewportBackgroundProps,
  };
};

export default useViewportHandlers;
