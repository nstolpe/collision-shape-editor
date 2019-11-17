// components/Vertices.js
import React from 'react';
import { connect } from 'react-redux';
import {
    Container,
} from 'react-pixi-fiber';

import {
    deleteVertex,
    moveVertex,
    startMoveVertex,
    stopMoveVertex,
} from 'actions/actions';

import Vertex from 'components/Vertex';
import ScreenContext from 'contexts/ScreenContext';


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    deleteVertex: id => dispatch(deleteVertex(id)),
    moveVertex: ({ x, y, id }) => dispatch(moveVertex({ x, y, id })),
    startMoveVertex: ({ x, y, id }) => dispatch(startMoveVertex({ x, y, id })),
    stopMoveVertex: ({ x, y, id }) => dispatch(stopMoveVertex({ x, y, id })),
});

const Vertices = props => (
    <Container>
        {props.vertices.map((vertex, idx) => {
            const { x, y, id } = vertex;
            const scale = [
                1 / props.UIScale.x,
                1 / props.UIScale.y,
            ];
            const ctrlPressed = props.ctrlPressed;
            const altPressed = props.altPressed;
            const movingVerticeIds = props.movingVerticeIds;
            const vertexProps = {
                ...props,
                id,
                x,
                y,
                scale,
                altPressed,
                ctrlPressed,
                movingVerticeIds,
                startMoveVertex,
                stopMoveVertex,
                moveVertex,
                deleteVertex,
            };
            return <Vertex key={`vertex_${id}`} { ...vertexProps } />;
        })}
    </Container>
);

export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(Vertices);
