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
    startMoveVertex,
    stopMoveVertex,
} from 'actions/actions';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    deleteVertex: id => dispatch(deleteVertex(id)),
    moveVertex: ({ x, y, id }) => dispatch(moveVertex({ x, y, id })),
    startMoveVertex: id => dispatch(startMoveVertex(id)),
    stopMoveVertex: id => dispatch(stopMoveVertex(id)),
});

const Vertex = props => {
    const {
        id,
        altPressed,
        ctrlPressed,
        movingVerticeIds,
        startMoveVertex,
        stopMoveVertex,
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
                        startMoveVertex(id);
                        break;
                    default:
                        break;
                }
            }}
            pointerup={e => {
                e.stopPropagation();
                // @TODO make stage available via context.
                // const stage = e.target.parent.parent.parent;
                console.log(e.target);
                // debugger;
                const graphic = e.target;
                // const sprite = stage.children[0].children[0].children[0];
                const graphicGlobalCoords = graphic.toGlobal({x:0,y:0});
                const pointGlobalCoords = e.target.toGlobal({x:0,y:0});
                console.log(`x: ${graphicGlobalCoords.x} y: ${graphicGlobalCoords.y}, x: ${pointGlobalCoords.x} y: ${pointGlobalCoords.y}`);
                console.log(`x diff: ${graphicGlobalCoords.x - pointGlobalCoords.x} y diff: ${graphicGlobalCoords.y - pointGlobalCoords.y}`);
                stopMoveVertex(id);
            }}
            pointerupoutside={e => {
                e.stopPropagation();
                stopMoveVertex(id);
            }}
            pointermove={e => {
                const coordinates = e.data.getLocalPosition(e.currentTarget.parent);
                if (movingVerticeIds.find(vertexId => e.currentTarget.name.replace('vertex_', '') === vertexId)) {
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
