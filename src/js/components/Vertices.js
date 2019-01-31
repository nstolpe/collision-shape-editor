// components/Vertices.js

import React from 'react';
import {
    Container,
    Sprite,
} from 'react-pixi-fiber';

import vertexSrc from '../../img/vertex.png';

const Vertices = props => (
    <Container>
        {props.vertices.reduce((result, vertex, idx) => [
            ...result,
            (<Sprite
                key={`vertex_${idx}`}
                texture={PIXI.Texture.fromImage(vertexSrc)}
                position={{ ...vertex }}
                tint="0xdf33c1"
                pivot={[5.5, 5.5]}
                interactive
            />)
        ], []) }
    </Container>
);

export default Vertices;
