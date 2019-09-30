const path = require('path');
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_URL = "./src";
const DEST_URL = "./dist/";

module.exports = {
  entry: {
    app: ["whatwg-fetch", "babel-polyfill", SRC_URL + '/index']
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    path: path.resolve(DEST_URL),
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      COGNITO_USER_POOL_ID: `"${process.env.COGNITO_USER_POOL_ID}"`,
      COGNITO_CLIENT_ID: `"${process.env.COGNITO_CLIENT_ID}"`,
      ENDPOINT_URL: `"${process.env.ENDPOINT_URL}"`,
      COGNITO_ENDPOINT_URL: `"${process.env.COGNITO_ENDPOINT_URL}"`,
      GA_TRACKING_ID: `"${process.env.GA_TRACKING_ID}"`,
      MODE: `"${process.env.MODE}"`
    }),
    new HtmlWebpackPlugin({
      title: 'TreeHacks Client',
      template: './src/index.html',
      filename: `./index.html`
    })
  ],
  module: {
    rules: [
      {
        test: [/\.tsx?$/],
        exclude: [/node_modules/, /\.test.tsx?$/],
        use:
          [
            {
              'loader': 'babel-loader',
              options: {
                "cacheDirectory": true,
                "presets": [
                  ["env", {
                    "targets": {
                      "browsers": [
                        "IE 8"
                      ]
                    }
                  }]
                ]
              }
            },
            {
              'loader': 'ts-loader'
            }
          ]
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'] //['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(svg|png|jpg|woff|eot|ttf|otf|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: "/"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules', 'scripts'],
    extensions: ['.ts', '.tsx', '.js']
  },
  node: {
    fs: "empty"
  },
  mode: 'development'
};
