const { addBeforeLoader, loaderByName, whenTest } = require("@craco/craco");

module.exports = {
  babel: {
    plugins: whenTest(() => ['rewire'], []),
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const glslLoader = {
        test: /\.glsl$/,
        exclude: /node_modules/,
        use:[
          {
            loader: require.resolve('webpack-glsl-loader'),
          },
        ],
      };

      webpackConfig.resolve.extensions.push('.glsl');
      addBeforeLoader(webpackConfig, loaderByName('file-loader'), glslLoader);

      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });

      return webpackConfig;
    },
  },
};
