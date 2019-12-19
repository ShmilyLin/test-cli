const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

// const config = require('./webpack.config.js');
const devConfig = require('./webpack.dev.js');

// webpackDevServer.addDevServerEntrypoints(devConfig, options);
const compiler = webpack(devConfig);
const server = new webpackDevServer(compiler);

server.listen(8086, 'localhost', () => {
  console.log('dev server listening on port 8088');
});