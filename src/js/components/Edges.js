// components/Edges.js
import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "Edges";
export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps: (instance, oldProps, newProps) => {
    const {
        vertices,
        // stroke,
        // weight,
    } = newProps;
    // const vertices = [
    //     { x: 100, y: 100 },
    //     { x: 200, y: 100 },
    //     { x: 200, y: 200 },
    //     { x: 100, y: 200 },
    // ];
    const stroke = 0xff0000;
    const weight = 1;

    instance.clear();
    instance.lineStyle(weight, stroke);

    if (vertices && vertices.length) {
        for (let i = 0, l = vertices.length; i <= l; i++) {
            const { x, y } = vertices[i] || vertices[0];
            switch (i) {
                case 0:
                    instance.moveTo(vertices[0].x, vertices[0].y);
                    break;
                default:
                    instance.lineTo(x, y);
                    break;

            }
        }
    }
  }
};

export default CustomPIXIComponent(behavior, TYPE);
