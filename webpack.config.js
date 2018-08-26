module.exports = {
  mode: 'none',
  entry: './src/entry.js',
  output: {
    filename: 'dirsnap-viewer.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
    ]
  },
  devtool: 'cheap-source-map',
  serve: {
    devMiddleware: {
      logLevel: 'warn',
    },
    hotClient: false,
  },
};
