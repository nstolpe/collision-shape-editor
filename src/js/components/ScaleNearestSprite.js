// src/js/components/ScaleNearestSprite.js

import * as PIXI from 'pixi.js';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Sprite } from 'react-pixi-fiber';

import ScreenContext from 'App/contexts/ScreenContext';

class ScaleNearestSprite extends PureComponent {
    constructor(props) {
        super(props);
        props.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.sprite = React.createRef();
    }

    componentDidMount() {
        const sprite = this.sprite.current;
        sprite.pivot.set(sprite.width * 0.5, sprite.height * 0.5);
    }

    render() {
        return (<Sprite ref={this.sprite} {...this.props} />);
    }
}

export default ScaleNearestSprite;
