const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => ({
  context: path.resolve(__dirname, 'src'),
  entry: './index.jsx',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  devServer: {
    port: process.env['PORT'],
    open: false,
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.jsx?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      Fonts: path.resolve(__dirname, 'src/fonts'),
      Actions: path.resolve(__dirname, 'src/actions'),
      Comparators: path.resolve(__dirname, 'src/comparators'),
      Components: path.resolve(__dirname, 'src/components'),
      Constants: path.resolve(__dirname, 'src/constants'),
      Contexts: path.resolve(__dirname, 'src/contexts'),
      Hooks: path.resolve(__dirname, 'src/hooks'),
      Reducers: path.resolve(__dirname, 'src/reducers'),
      Selectors: path.resolve(__dirname, 'src/selectors'),
      Shaders: path.resolve(__dirname, 'src/shaders'),
      Store: path.resolve(__dirname, 'src/store'),
      Utility: path.resolve(__dirname, 'src/utility'),
    },
    extensions: ['.js', '.jsx', '.glsl'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/public/index.html'),
      ENV: JSON.stringify(env),
    }),
  ],
});
