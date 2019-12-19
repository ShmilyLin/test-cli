const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});