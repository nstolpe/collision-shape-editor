const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: ["@babel/polyfill", "./src/index.js"],
    foo: ["@babel/polyfill", "./src/foo.js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src', 'js'),
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ['main'],
      template: './src/index.html',
      filename: './index.html',
    }),
    new HtmlWebPackPlugin({
      template: './src/foo.html',
      chunks: ['foo'],
      filename: './foo.html',
    })
  ],
  devtool: 'source-map',
};
