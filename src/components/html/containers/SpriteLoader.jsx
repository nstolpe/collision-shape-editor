// src/components/html/containers/SpriteLoader.jsx
import * as PIXI from 'pixi.js';

import { addTextureSource, addSprite } from 'actions/actions';

import RootContext from 'contexts/RootContext';
import withSelector from 'components/hoc/withSelector';
import FileLoader from 'components/html/FileLoader';

const imageMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

const selector = ({
  dispatch,
  pixiApp,
  viewportCenter,
}) => ({
  dispatch,
  pixiApp,
  viewportCenter,
});

const Container = ({ dispatch, pixiApp, viewportCenter, ...props }) => {
  const onChange = event => {
    const { nativeEvent : { target: { files } } } = event;

    if (files.length) {
      const { loader } = pixiApp;
      const loadedKeys = [];

      for (let i = 0, l = files.length; i < l; i++) {
        const file = files[i];
        const { name, type } = file;

        if (!imageMimeTypes.includes(type)) {
          console.log(`@TODO: implement error notification. ${name} had invalid mime type ${type}`);
          continue;
        }

        if (!loader.resources[name]) {
          const reader = new FileReader();

          // eslint-disable-next-line no-loop-func
          reader.onload = event => {
            loader.add(name, event.target.result);

            loadedKeys.push(name);

            if (loadedKeys.length >= files.length) {
              loader.load((currentLoader, resources) => {
                loadedKeys.forEach(key => {

                  dispatch(addSprite({
                    name: key,
                    texture: resources[key].texture,
                    x: viewportCenter.x,
                    y: viewportCenter.y,
                    rotation: 0,
                    scale: [1, 2],
                    scaleMode: PIXI.SCALE_MODES.NEAREST,
                  }));
                });
              });
            }
          };

          reader.readAsDataURL(file);
        } else {
          console.log('@TODO: decide what to do when a file name is already used');
        }
      }
    }
  };

  const onLoad = (name, event) => {
    const data = event.target.result;
    const image = new Image();
    image.onload = () => document.body.append(image);
    image.src = data;

    console.log('load image');
    dispatch(addTextureSource(name, data));
  };

  return (
    <FileLoader
      onChange={onChange}
      onLoad={onLoad}
      {...props}
    />
  );
};

export default withSelector(RootContext, selector)(Container);
// @TODO consider setting texture sources from each of the files, then assign them
// from the store to a sprite, so they can be reused easily.
// useEffect(
//   () => {
//     textureSources.forEach(textureSource => {
//       if (!loader.resources[textureSource.id]) {
//         loader.add(textureSource.id, textureSource.data);
//         removeTextureSource(textureSource);
//       } else {
//         // notify that load didn't happen
//       }
//     });
//     loader.load((loader, resources) => {
//       textureSources.forEach(textureSource => {
//         addSprite({
//           name: textureSource.id,
//           texture: resources[textureSource.id].texture,
//           x: screenWidth * 0.5,
//           y: screenHeight * 0.5,
//           rotation: 0,
//           scale: [1, 1],
//           scaleMode: PIXI.SCALE_MODES.NEAREST,
//         });
//       });
//     });
//   },
//   [
//     textureSources,
//     loader,
//     screenHeight,
//     screenWidth
//   ]
// );
