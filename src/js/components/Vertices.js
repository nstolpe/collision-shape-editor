// components/Vertices.js

import React from 'react';
import * as PIXI from 'pixi.js';
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
                pointerdown={e => {
                    e.stopPropagation();
                    console.log(`vertex_${idx}`);
                    console.log(e);
                }}
                hitArea={new PIXI.Circle(5.5, 5.5, 5.5)}
            />)
        ], []) }
    </Container>
);

export default Vertices;
