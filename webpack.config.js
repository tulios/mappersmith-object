var webpack = require('webpack');
var version = require('./package.json').version;
var plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false }
    }),
    new webpack.BannerPlugin(
      'MappersmithObject ' + version + '\nhttps://github.com/tulios/mappersmith-object'
    )
  ];
}

module.exports = {
  entry: './index.js',
  output: {
    path: './build',
    filename: 'mappersmith-object.js',
    library: "MappersmithObject",
    libraryTarget: "umd"
  },
  plugins: plugins
}
