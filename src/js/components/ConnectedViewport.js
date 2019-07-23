// src/js/components/ConnectedViewport.js
import * as PIXI from 'pixi.js';
import { connect } from "react-redux";
import React, { useEffect } from 'react';

import {
    addSprite,
    removeTextureSource,
    scaleUI,
} from 'App/actions/actions';
import ScreenContext from 'App/contexts/ScreenContext';
import Viewport from 'App/components/Viewport';

const mapStateToProps = (state, ownProps) => ({ ...state });

const mapDispatchToProps = dispatch => ({
    removeTextureSource: textureSource => dispatch(removeTextureSource(textureSource)),
    addSprite: sprite => dispatch(addSprite(sprite)),
    scaleUI: scale => dispatch(scaleUI(scale)),
});

const ConnectedViewport = props => {
    const {
        textureSources = [],
        removeTextureSource,
        app: { loader: loader },
        addSprite,
        screenWidth,
        screenHeight,
    } = props;

    useEffect(
        () => {
            textureSources.forEach(textureSource => {
                if (!loader.resources[textureSource.id]) {
                    loader.add(textureSource.id, textureSource.data);
                    removeTextureSource(textureSource);
                } else {
                    // notify that load didn't happen
                }
            });
            loader.load((loader, resources) => {
                textureSources.forEach(textureSource => {
                    addSprite({
                        name: textureSource.id,
                        texture: resources[textureSource.id].texture,
                        x: screenWidth * 0.5,
                        y: screenHeight * 0.5,
                        rotation: 0,
                        scale: [1, 1],
                        scaleMode: PIXI.SCALE_MODES.NEAREST,
                    });
                });
            });
        },
        [props.textureSources]
    );

    return (<Viewport {...props} />)
};

export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(ConnectedViewport);
