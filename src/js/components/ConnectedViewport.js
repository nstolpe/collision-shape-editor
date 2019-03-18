// src/js/components/ConnectedViewport.js
import * as PIXI from 'pixi.js';
import { connect } from "react-redux";
import React, {
    PureComponent,
    useState,
} from 'react';

import {
    addSprite,
    removeTextureSource,
} from 'App/actions/actions';
import ScreenContext from 'App/contexts/ScreenContext';
import Viewport from 'App/components/Viewport';

const mapStateToProps = (state, ownProps) => ({ ...state });

const mapDispatchToProps = dispatch => ({
    removeTextureSource: textureSource => dispatch(removeTextureSource(textureSource)),
    addSprite: sprite => dispatch(addSprite(sprite)),
});

class ConnectedViewport extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(/*prevProps, prevState, snapshot*/) {
        const {
            textureSources,
            removeTextureSource,
            app: { loader: loader },
            addSprite,
        } = this.props;

        window.app = this.props.app;

        if (textureSources.length) {
            textureSources.forEach(textureSource => {
                if (!loader.resources[textureSource.id]) {
                    loader.add(textureSource.id, textureSource.data);
                    removeTextureSource(textureSource);
                } else {
                    // notify that load didn't happen
                }
            });
            loader.load((loader, resources) => {
                console.log(loader, resources);
                textureSources.forEach(textureSource => {
                    addSprite({
                        name: textureSource.id,
                        texture: resources[textureSource.id].texture,
                        x: 0,
                        y: 0,
                        rotation: 0,
                        scale: [1, 1],
                        scaleMode: PIXI.SCALE_MODES.NEAREST,
                    });
                });
            });
        }
    }

    render() {
        return (
            <Viewport
                screenWidth={this.props.app.stage.width}
                screenHeight={this.props.app.stage.height}
                worldWidth={this.props.width}
                worldHeight={this.props.height}
                {...this.props}
            />
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, { context: ScreenContext })(ConnectedViewport);
