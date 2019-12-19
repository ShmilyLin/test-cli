const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.[hash].js',
        chunkFilename:'js/chunk.[chunkhash].js',
        publicPath: './',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, "src"),
            loader: 'babel-loader',
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ],
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader',
            ],
        }, {
            test: /\.(scss|sass)$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ]
        }],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunksSortMode: 'none'
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist'),
            ignore: [path.resolve(__dirname, 'public/index.html')],
        }]),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "manifest",
        //     minChunks: Infinity
        // }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};