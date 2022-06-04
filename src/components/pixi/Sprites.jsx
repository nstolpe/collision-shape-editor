// src/js/components/pixi/Sprites.js
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Sprite } from 'react-pixi-fiber';

import withSelector from 'components/hoc/withSelector';
import ScaleNearestSprite from 'components/pixi/ScaleNearestSprite';
import { useScreenContext } from 'contexts/ScreenContext';
import ScreenContext from 'contexts/ScreenContext';

const selector = ({ sprites }) => ({ sprites });

const Sprites = ({ sprites }) => (
  <>
    {sprites.map(({ name, texture, x, y, rotation, scale, scaleMode }) => {
      const id = `${uuid()}::${name}`
      return (<ScaleNearestSprite
        key={name}
        name={name}
        texture={texture}
        x={x}
        y={y}
        rotation={rotation}
        interactive
        pointerdown={e => console.log(e)}
      />)
    })}
  </>
);

export default withSelector(ScreenContext, selector)(Sprites);
