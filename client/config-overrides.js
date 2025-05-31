const path = require('path');

module.exports = function override(config, env) {
  // Add widget entry point
  config.entry = {
    main: path.resolve(__dirname, 'src/index.js'),
    widget: path.resolve(__dirname, 'src/widget.js')
  };

  // Modify output configuration
  config.output = {
    ...config.output,
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
    library: 'BeautyChatbot',
    libraryTarget: 'umd',
    globalObject: 'this'
  };

  return config;
}; 