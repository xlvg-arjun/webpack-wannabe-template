const process = require('process');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpack = require('webpack');

const Merge = require('webpack-merge');

const { join } = require('path');

const commonConfig = {
  entry: './src/app.ts',
  output: {
    path: join(__dirname, 'dist'),
    filename: './build.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.html']
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      { 
        test: /\.styl$/, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',

          use: ['css-loader', 'stylus-loader']
        })
      },

      { 
        test: /\.((ts)|(tsx))$/, 
        use: ['ts-loader'] 
      },

      {
        test: /\.html$/,
        use: [
              {
                loader: "file-loader",
                options: {
                  name: "[name].html",
                },
              },
            
              {
                loader: "extract-loader",
              },

              {
                loader: "html-loader",
                options: {
                  // attrs: ["img:src", "link:href"],
                  // interpolate: true,
                },
            },
          ],
      }
    ]
  },
  plugins: [new ExtractTextPlugin('style.css')]
};

const devConfig = {
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 8080,
  }
};

const prodConfig = {
  devtool: 'source-map',
  plugins: [
  //   new UglifyJSPlugin({
  //   extractComments: true,
  //   sourceMap: true
  // })
  new webpack.optimize.UglifyJsPlugin({ 
    sourceMap: true,
    beautify: false,
    comments: false,
    compress: {
      warnings: false,
      drop_console: true,
      screw_ie8: true
    },
   })
  ]
};

module.exports = (process.env.NODE_ENV === 'development' ? Merge(commonConfig, devConfig) : Merge(commonConfig, prodConfig)); 
