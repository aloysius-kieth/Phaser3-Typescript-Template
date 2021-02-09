const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    port: 9002
  }
}

module.exports = merge(common, dev)
