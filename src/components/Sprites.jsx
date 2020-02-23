// src/js/components/Sprites.js
import React from 'react';
import {v4 as uuid} from 'uuid';

import ScaleNearestSprite from 'components/ScaleNearestSprite';
import { useScreenContext } from 'contexts/ScreenContext';

const Sprites = () => {
    const { sprites } = useScreenContext();

    return (
        <>
            {sprites.map(({ name, texture, x, y, rotation, scale, scaleMode }) => {
                const id = `${uuid()}::${name}`
                return (<ScaleNearestSprite
                    key={id}
                    name={id}
                    texture={texture}
                    x={x}
                    y={y}
                    rotation={rotation}
                    // pivot
                />)
            })}
        </>
    );
};

export default Sprites;
