// components/Vertices.js

import React from 'react';
import { connect } from "react-redux";
import * as PIXI from 'pixi.js';
import {
    Container,
    Sprite,
} from 'react-pixi-fiber';

import {
    moveVertex,
    startVertexMove,
    stopVertexMove,
} from 'App/actions/action';

import vertexSrc from '../../img/vertex.png';

const mapStateToProps = state => {
    console.log(state);
    return { ...state }
};
const mapDispatchToProps = dispatch => ({
    moveVertex: ({ x, y, id }) => dispatch(moveVertex({ x, y, id })),
    startVertexMove: ({ x, y, id }) => dispatch(startVertexMove({ x, y, id })),
    stopVertexMove: ({ x, y, id }) => dispatch(stopVertexMove({ x, y, id })),
});

const foo = {};
const Vertices = props => (
    <Container>
        {props.vertices.reduce((result, vertex, idx) => {
            const { x, y, id } = vertex;
            console.log('in the jsx', vertex, props);
            return [
                ...result,
                (<Sprite
                    key={`vertex_${id}`}
                    name={`vertex_${id}`}
                    texture={PIXI.Texture.fromImage(vertexSrc)}
                    position={{ x, y }}
                    tint={props.tint || 0xff3e82}
                    alpha={props.alpha || 0.8}
                    pivot={[5.5, 5.5]}
                    interactive
                    // pointertap={e => {
                    //     e.stopPropagation();
                    //     console.log(`vertex_${id}`);
                    //     console.log(e);
                    // }}
                    pointerdown={e => {
                        e.stopPropagation();
                        props.startVertexMove(vertex);
                        console.log('foo.data', foo.data);
                        // foo.data = event.data;
                        // e.currentTarget.alpha = 0.5;
                        // foo.dragging = true;
                    }}
                    pointerup={e => {
                        e.stopPropagation();
                        e.currentTarget.alpha = 1;
                        props.stopVertexMove(vertex);
                        // foo.dragging = false;
                        // set the interaction data to null
                        // foo.data = null;
                    }}
                    pointerupoutside={e => {
                        e.stopPropagation();
                        e.currentTarget.alpha = 1;
                        props.stopVertexMove(vertex);
                        // foo.dragging = false;
                        // set the interaction data to null
                        // foo.data = null;
                    }}
                    pointermove={e => {
                        const coordinates = e.data.getLocalPosition(e.currentTarget.parent);
                        console.log('pointermove', { ...vertex, ...coordinates }, coordinates)
                        props.moveVertex({ ...vertex, ...coordinates });
                        // if (foo.dragging) {
                            // const newPosition = e.data.getLocalPosition(e.currentTarget.parent);
                            // e.currentTarget.x = newPosition.x;
                            // e.currentTarget.y = newPosition.y;
                        // }
                    }}
                    hitArea={new PIXI.Circle(5.5, 5.5, 5.5)}
                />)
            ]
        }, [])}
    </Container>
);

// export default Vertices;
export default connect(mapStateToProps, mapDispatchToProps)(Vertices);
