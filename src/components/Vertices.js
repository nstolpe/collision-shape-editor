// components/Vertices.js
import React from 'react';
import { connect } from 'react-redux';
import {
    Container,
} from 'react-pixi-fiber';

import {
    deleteVertex,
    moveVertex,
    startVertexMove,
    stopVertexMove,
} from 'actions/actions';

import Vertex from 'components/Vertex';
import ScreenContext from 'contexts/ScreenContext';


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    deleteVertex: id => dispatch(deleteVertex(id)),
    moveVertex: ({ x, y, id }) => dispatch(moveVertex({ x, y, id })),
    startVertexMove: ({ x, y, id }) => dispatch(startVertexMove({ x, y, id })),
    stopVertexMove: ({ x, y, id }) => dispatch(stopVertexMove({ x, y, id })),
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
            const movingVertices = props.movingVertices;
            const vertexProps = {
                ...props,
                id,
                x,
                y,
                scale,
                altPressed,
                ctrlPressed,
                movingVertices,
                startVertexMove,
                stopVertexMove,
                moveVertex,
                deleteVertex,
            };
            return <Vertex key={`vertex_${id}`} { ...vertexProps } />;
        })}
    </Container>
);

export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(Vertices);
