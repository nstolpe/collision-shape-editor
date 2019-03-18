// src/js/components/Sprites.js

import React from 'react';
import { connect } from 'react-redux';
import {v4 as uuid} from 'uuid';

import ScaleNearestSprite from 'App/components/ScaleNearestSprite';
import ScreenContext from 'App/contexts/ScreenContext';

const mapStateToProps = (state, ownProps) => {
    const { width, height } = ownProps;
    return { ...state, width, height };
};

const Sprites = ({ sprites }) => {
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

export default connect(mapStateToProps, null, null, { context: ScreenContext })(Sprites);
