const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, ""),
    publicPath: '/',
    historyApiFallback: true,
    port: 9000,
    watchOptions: {
      poll: 1000
    }
  }
});
