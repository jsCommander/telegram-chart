const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
});