"use strict";

const webpack = require('webpack');
const path = require('path');
const debug = process.env.NODE_ENV !== "production";

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  devServer: {
    historyApiFallback: true,
    contentBase: 'src/static',
    host: '0.0.0.0',
    port: 8888
  },
  output: {
    path: path.join(__dirname, 'src', 'static', 'js'),
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        loader: ['babel-loader'],
        query: {
          cacheDirectory: 'babel_cache',
          presets: debug
                   ? ['react', 'es2015', 'react-hmre']
                   : ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: debug ? [] : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    }),
  ]
};
