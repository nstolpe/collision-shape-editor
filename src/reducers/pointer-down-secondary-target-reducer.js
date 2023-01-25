import { EDGE, SHAPE, VERTEX, VIEWPORT } from 'Constants/prefixes';
import * as PIXI from 'pixi.js';

/**
 * Reducer that handles a SECONDARY (right mouse button) pointer down. Passes control on to a target
 * specific reducer.
 */
const reducer = (state, { data, type }) => {
  switch (type) {
    case EDGE:
      return state;
    case SHAPE:
      return state;
    case VERTEX:
      return state;
    case VIEWPORT: {
      const {
        coordinates: { x, y },
      } = data;
      const { pixiApp, shapes } = state;
      const viewport = pixiApp.stage.children[0];

      for (let shapeKey of shapes.keys) {
        const shape = shapes.key(shapeKey);
        const polygon = new PIXI.Polygon(shape.vertices.values);
        const local = viewport.toLocal({ x, y });

        // @TODO z-index could be weird here, w/ overlapping shapes.
        if (polygon.contains(local.x, local.y)) {
          const contextMenu = {
            type: SHAPE,
            x,
            y,
            options: {
              shape,
              shapeKey,
            },
          };
          return {
            ...state,
            contextMenu,
          };
        }
      }
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
