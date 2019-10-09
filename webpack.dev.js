const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: __dirname,
    publicPath: '/dist',
    historyApiFallback: {
      index: 'index.html'
    },
    port: 9000,
    watchOptions: {
      poll: 1000
    }
  }
});
