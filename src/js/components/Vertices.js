// components/Vertices.js

import React from 'react';
import { connect } from "react-redux";
import * as PIXI from 'pixi.js';
import {
    Container,
    Sprite,
} from 'react-pixi-fiber';

import {
    deleteVertex,
    moveVertex,
    startVertexMove,
    stopVertexMove,
} from 'App/actions/action';

import vertexSrc from '../../img/vertex.png';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    deleteVertex: id => dispatch(deleteVertex(id)),
    moveVertex: ({ x, y, id }) => dispatch(moveVertex({ x, y, id })),
    startVertexMove: ({ x, y, id }) => dispatch(startVertexMove({ x, y, id })),
    stopVertexMove: ({ x, y, id }) => dispatch(stopVertexMove({ x, y, id })),
});

const foo = {};
const Vertices = props => (
    <Container>
        {props.vertices.reduce((result, vertex, idx) => {
            const { x, y, id } = vertex;
            const scale = {
                x: 1 / props.UIScale.x,
                y: 1 / props.UIScale.y,
            };
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
                    scale={scale}
                    // pointertap={e => {
                    //     e.stopPropagation();
                    //     console.log(`vertex_${id}`);
                    //     console.log(e);
                    // }}
                    pointerdown={e => {
                        e.stopPropagation();
                        switch (true) {
                            case e.data.originalEvent.altKey && !e.data.originalEvent.ctrlKey:
                                props.deleteVertex(vertex.id);
                                break;
                        }
                        props.startVertexMove(vertex);
                        // console.log('foo.data', foo.data);
                    }}
                    pointerup={e => {
                        e.stopPropagation();
                        props.stopVertexMove(vertex);
                    }}
                    pointerupoutside={e => {
                        e.stopPropagation();
                        props.stopVertexMove(vertex);
                    }}
                    pointermove={e => {
                        const coordinates = e.data.getLocalPosition(e.currentTarget.parent);
                        if (props.movingVertices.find(vertex => e.currentTarget.name.replace('vertex_', '') === vertex.id)) {
                            props.moveVertex({ ...vertex, ...coordinates });
                        }
                    }}
                    hitArea={new PIXI.Circle(5.5, 5.5, 5.5)}
                />)
            ]
        }, [])}
    </Container>
);

export default connect(mapStateToProps, mapDispatchToProps)(Vertices);
