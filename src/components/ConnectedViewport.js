// src/js/components/ConnectedViewport.js
import * as PIXI from 'pixi.js';
import { connect } from "react-redux";
import React, { useEffect, useContext, useRef, useState } from 'react';

import {
    addSprite,
    addVertex,
    removeTextureSource,
    scaleUI,
} from 'actions/actions';
import ScreenContext from 'contexts/ScreenContext';
import Viewport from 'components/Viewport';

const mapStateToProps = (state, ownProps) => ({ ...state });

const mapDispatchToProps = dispatch => ({
    removeTextureSource: textureSource => dispatch(removeTextureSource(textureSource)),
    addSprite: sprite => dispatch(addSprite(sprite)),
    addVertex: ({x, y }) => dispatch(addVertex({ x, y })),
    scaleUI: scale => dispatch(scaleUI(scale)),
});

const ConnectedViewport = props => {
    const viewport = useRef(null);
    // const [backgroundColor, setBackgroundColor] = useState(props.backgroundColor);
    const {
        textureSources = [],
        backgroundColor,
        removeTextureSource,
        app: { loader, renderer },
        addSprite,
        screenWidth,
        screenHeight,
    } = props;
    const context = useContext(ScreenContext);
    // debugger;
    useEffect(() => {
        renderer.backgroundColor = backgroundColor;
    }, [renderer, backgroundColor]);

    // useEffect(() => {
    //     console.log('viewport')
    //     console.log(viewport)
    //     viewport.current
    //         .drag()
    //         .pinch()
    //         // .wheel({ percent: 0.05 })
    //         .resize();
    // }, []);

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
        [textureSources, addSprite, loader, removeTextureSource, screenHeight, screenWidth]
    );

    return (
        <Viewport
            ref={viewport}
            drag
            pinch
            wheel={{ percent: 0.05 }}
            onzoomed={({ viewport }) => props.scaleUI(viewport.scale)}
            {...props}
        />
    )
};

export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(ConnectedViewport);
