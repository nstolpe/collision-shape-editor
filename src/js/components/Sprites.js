// src/js/components/Sprites.js

import React from 'react';
import { connect } from 'react-redux';
import { Sprite } from 'react-pixi-fiber';
import {v4 as uuid} from 'uuid';

import ScreenContext from 'App/contexts/ScreenContext';

const mapStateToProps = state => ({ ...state });

const Sprites = ({sprites}) => {
    return (
        <>
            {sprites.map(({ name, texture, x, y, rotation, scale, scaleMode }) => {
                const id = `${uuid()}::${name}`
                return (<Sprite
                    key={id}
                    name={id}
                    texture={texture}
                    x={x}
                    y={y}
                    rotation={rotation}
                />)
            })}
        </>
    );
};

export default connect(mapStateToProps, null, null, { context: ScreenContext })(Sprites);
