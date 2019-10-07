// components/Vertex.js
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Circle from 'components/Circle';
import ScreenContext from 'contexts/ScreenContext';

import {
    deleteVertex,
    moveVertex,
    startVertexMove,
    stopVertexMove,
} from 'actions/actions';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    deleteVertex: id => dispatch(deleteVertex(id)),
    moveVertex: ({ x, y, id }) => dispatch(moveVertex({ x, y, id })),
    startVertexMove: ({ x, y, id }) => dispatch(startVertexMove({ x, y, id })),
    stopVertexMove: ({ x, y, id }) => dispatch(stopVertexMove({ x, y, id })),
});

const Vertex = props => {
    const {
        id,
        altPressed,
        ctrlPressed,
        movingVertices,
        startVertexMove,
        stopVertexMove,
        moveVertex,
        deleteVertex,
        ...propsRest
    } = props;
    return (
        <Circle
            name={`vertex_${id}`}
            interactive
            buttonMode
            // cursor={props.altPressed ? "no-drop" : "move"}
            // onPointerTap={e => {
            //     // e.stopPropagation();
            //     console.log(`vertex_${id}`);
            //     console.log(e);
            // }}
            pointerdown={e => {
                e.stopPropagation();
                console.log(e);
                switch (true) {
                    case altPressed && !ctrlPressed:
                        deleteVertex(id);
                        break;
                    case !altPressed && !ctrlPressed:
                        startVertexMove({ x: e.target.x, y: e.target.y, id });
                        break;
                    default:
                        break;
                }
            }}
            pointerup={e => {
                e.stopPropagation();
                // @TODO make stage available via context.
                const stage = e.target.parent.parent.parent;
                console.log(e.target);
                // debugger;
                const graphic = e.target;
                // const sprite = stage.children[0].children[0].children[0];
                const graphicGlobalCoords = graphic.toGlobal({x:0,y:0});
                const pointGlobalCoords = e.target.toGlobal({x:0,y:0});
                console.log(`x: ${graphicGlobalCoords.x} y: ${graphicGlobalCoords.y}, x: ${pointGlobalCoords.x} y: ${pointGlobalCoords.y}`);
                console.log(`x diff: ${graphicGlobalCoords.x - pointGlobalCoords.x} y diff: ${graphicGlobalCoords.y - pointGlobalCoords.y}`);
                stopVertexMove({ x: e.target.x, y: e.target.y, id });
            }}
            pointerupoutside={e => {
                e.stopPropagation();
                stopVertexMove({ x: e.target.x, y: e.target.y, id });
            }}
            pointermove={e => {
                const coordinates = e.data.getLocalPosition(e.currentTarget.parent);
                if (movingVertices.find(vertex => e.currentTarget.name.replace('vertex_', '') === vertex.id)) {
                    moveVertex({ ...coordinates, id });
                }
            }}
            hitArea={new PIXI.Circle(0, 0, 5.5)}
            {...propsRest}
        />
    );
};

Vertex.defaultProps = {
    alpha: 0.8,
    radius: 4.5,
    fill: 0xe62bdc,
    strokeColor: 0xffffff,
    strokeWidth: 2,
    strokeAlignment: 1,
};

Vertex.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    alpha: PropTypes.number,
    radius: PropTypes.number,
    fill: PropTypes.number,
    strokeColor: PropTypes.number,
    strokeWidth: PropTypes.number,
    strokeAlignment: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(Vertex);
