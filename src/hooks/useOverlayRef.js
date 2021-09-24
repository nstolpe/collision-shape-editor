// src/js/hooks/useOverlayRef.js
import * as PIXI from 'pixi.js';
import { useContext, useEffect, useRef, useState } from 'react';
import { usePixiApp } from 'react-pixi-fiber';
import ScreenContext from 'contexts/ScreenContext';
import useCustomCompareMemo from 'hooks/useCustomCompareMemo';
import selectOverlayComparator from 'comparators/select-overlay';
import scaleComparator from 'comparators/scale';
import selectOverlaySelector from 'selectors/select-overlay';

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
  if (!scaleComparator({ scale }, { scale: oldScale })) {
    return false;
  }

  if (!selectOverlayComparator(selectOverlayProps, oldSelectOverlayProps)) {
    return false;
  }

  return true;
};

const useOverlayRef = target => {
  const ref = useRef();
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
  // const [time, setTime] = useState(ticker.lastTime);
  // @TODO add option to enable/disable, and throttle
  // ticker.add(() => setTime(ticker.lastTime));

  useEffect(() => {
    if (target && ref.current !== target) {
      ref.current = target;
    }

    if (ref.current) {
      if (enabled) {
        const fragment = `
          precision highp float;
          varying vec2 vTextureCoord;

          uniform sampler2D uSampler;
          uniform vec4 inputSize;
          uniform vec4 inputPixel;
          uniform vec4 outputFrame;
          uniform float x1;
          uniform float x2;
          uniform float y1;
          uniform float y2;
          uniform float time;
          uniform float scaleX;
          uniform float scaleY;

          void main(void) {
            vec2 position = vTextureCoord * inputPixel.xy;
            // vec2 position = vTextureCoord * inputSize.xy / outputFrame.zw;
            vec4 color = texture2D(uSampler, vTextureCoord);

            float x = floor(position.x);
            float y = floor(position.y);
            float left = floor(x1);
            float right = floor(x2) - 1.0;
            float top = floor(y1);
            float bottom = floor(y2) - 1.0;

            if (
              (x >= min(left, right) && x <= max(left, right) && (y == top || y == bottom)) ||
              (y >= min(top, bottom) && y <= max(top, bottom) && (x == left || x == right))
            ) {
              // it's along the selection top or bottom, so it gets processed
              float total = (abs(x1 - x2) * 2.0) + (abs(y1 - y2) * 2.0);
              float edgePosition = 0.0;

              if (x == left) {
                // the point is on the left edge
                if (y == top) {
                  // the point is at top left corner
                  edgePosition = 0.0;
                } else if (y == bottom) {
                  // the point is at bottom left corner
                  edgePosition = abs(bottom - top);
                } else {
                  // the point is somewhere along the left side
                  edgePosition = abs(y - top);
                }
              } else if (x == right) {
                // the point is on the right edge
                if (y == top) {
                  // the point is at the top right corner
                  edgePosition = (abs(bottom - top) * 2.0) + abs(left - right);
                } else if (y == bottom) {
                  // the point is at the bottom right corner
                  edgePosition = abs(bottom - top) + abs(left - right);
                } else {
                  // the point is on the right side
                  edgePosition = abs(bottom - top) + abs(left - right) + abs(y - top);
                }
              } else {
                // the point is along top or bottom
                if (y == top) {
                  // the point is along the top
                  edgePosition = (abs(bottom - top) * 2.0) + abs(left - right) + abs(x - right);
                } else if (y == bottom) {
                  // the point is along the bottom
                  edgePosition = abs(bottom - top) + abs(x - right);
                }
              }

              // move the ants
              // position = position + floor(time / 1000.0) * 100.0;
              // edgePosition = edgePosition + floor(time / 500.0) * 100.0;
              edgePosition = edgePosition + mod(floor(time/200.0), 4.0);
              // the nth set of 4 'edgePosition' is in
              float segment = floor(edgePosition / 4.0);

              if (mod(segment, 2.0) == 0.0) {
                gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, 1.0);
              } else {
                // odds get their normal color
                gl_FragColor = color;
              }
            } else {
              // it's not along one of the edges
              gl_FragColor = color;
            }
            // gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
          }
        `;

        const filter = new PIXI.Filter(
          undefined,
          fragment,
          {
            // @TODO there
            x1: (x * scale.x) + ref.current.getGlobalPosition().x,
            x2: ((x + width) * scale.x) + ref.current.getGlobalPosition().x,
            y1: (y * scale.y) + ref.current.getGlobalPosition().y,
            y2: ((y + height) * scale.y) + ref.current.getGlobalPosition().y,
            // time,
          }
        );

        ref.current.filters = [filter];
      } else {
        ref.current.filters = [];
      }
    }
  }, [
    height,
    width,
    x, y,
    // time,
    target,
    enabled,
    scale.x,
    scale.y
  ]);

  return ref;
};

export default useOverlayRef;
