// src/js/components/base/Drawing.js

import { CustomPIXIComponent } from 'react-pixi-fiber/index.js';
import * as PIXI from 'pixi.js';

const TYPE = 'Drawing';

export const behavior = {
  customDisplayObject: (props) => new PIXI.Graphics(),
  customApplyProps: function (graphicsInstance, oldProps, newProps) {
    let oldPropsFinal;
    let newPropsFinal;

    const { clear: oldClear, draw: oldDraw, ...oldPropsRest } = oldProps || {};

    const { clear = true, draw, ...newPropsRest } = newProps;

    // if clear is false, the drawing can be continuously drawn on
    if (typeof oldProps !== 'undefined' && clear) {
      graphicsInstance.clear();
    }

    if (typeof draw === 'function') {
      // takes a draw prop that is a function with graphicsInstance, oldProps and newProps as arguments.
      // return old and new props as the 0 and 1 elements of an array if you want to don't want to pass
      // them all on to the PIXI.Graphic object.
      [oldPropsFinal, newPropsFinal] = draw(
        graphicsInstance,
        oldPropsRest,
        newPropsRest
      );
    } else {
      oldPropsFinal = oldPropsRest;
      newPropsFinal = newPropsRest;
    }

    this.applyDisplayObjectProps(oldPropsFinal, newPropsFinal);
  },
  customWillDetach: (graphicsInstance) => graphicsInstance.destroy(),
};

export default CustomPIXIComponent(behavior, TYPE);
