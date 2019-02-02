// components/Edges.js
import { CustomPIXIComponent } from "react-pixi-fiber";
import { connect } from "react-redux";
import * as PIXI from "pixi.js";

const TYPE = "Edges";
const mapStateToProps = state => ({ ...state });

export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps: (instance, oldProps, newProps) => {
    const {
        vertices,
        stroke,
        weight,
        alpha,
        UIScale,
    } = Object.assign({
        stroke: 0xff3e82,
        weight: 1,
        alpha: 0.8,
        UIScale: 1,
    }, newProps);

    instance.clear();
    instance.alpha = alpha;
    instance.lineStyle(weight / UIScale.x, stroke);
    instance.hitArea = new PIXI.Polygon(vertices.reduce((points, vertex) => [ ...points, vertex.x, vertex.y ], []));
    instance.interactive = true;

    if (typeof newProps.pointerdown === 'function' && typeof oldProps.pointerdown === 'function' && newProps.pointerdown !== oldProps.pointerdown) {
        instance.off('pointerdown', oldProps.pointerdown);
        instance.on('pointerdown', newProps.pointerdown);
    } else if (typeof newProps.pointerdown === 'function' && typeof oldProps.pointerdown !== 'function') {
        instance.on('pointerdown', newProps.pointerdown);
    } else if (typeof oldProps.pointerdown === 'function' && typeof newProps.pointerdown !== 'function') {
        instance.off('pointerdown', oldProps.pointerdown);
    }

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

export default connect(mapStateToProps)(CustomPIXIComponent(behavior, TYPE));
