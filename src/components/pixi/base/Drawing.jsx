import { CustomPIXIComponent } from 'react-pixi-fiber/index.js';
import * as PIXI from 'pixi.js';

/**
 * A basic component for drawing something using PIXI.Graphics.
 * customApplyProps does the drawing. Don't add any logic here to
 * change the graphics instance, use props instead. See Edge or Vertex
 * for how to do cacheAsBitmap
 */
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
      // return old and new props as the 0 and 1 elements of an array if you don't want to pass them all
      // on to the PIXI.Graphic object.
      // @TODO: this returning filtered props things is weird. does it need to happen?
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
  // graphicsInstance.destroy() is already being called somewhere else,
  // so this is causing an error because internally this is getting more then necessary:
  // this._geometry.refCount--
  // 2nd time through there is no _geometry on this, so error
  // other destroy call is from a removeChild call from the Drawing's parent:
  // https://github.com/michalochman/react-pixi-fiber/blob/1e6014427e8e7859a60fac1b74b3e6a330d396eb/src/ReactPixiFiber.js#L35-L43
  // Maybe there should be a check for `if (!_child_destroyed)` around the `child.destroy` call,
  // in case a custom component doesn't have a parent to destroy it of for some other reason wants to call destroy?
  // customWillDetach: (graphicsInstance) => {
  //   graphicsInstance.destroy();
  // },
};

export default CustomPIXIComponent(behavior, TYPE);
