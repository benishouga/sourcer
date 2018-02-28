const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    main: './src/main/client/main.tsx',
    standalone: './src/main/client/standalone.tsx',
    arenaWorker: './src/main/client/arenaWorker.ts'
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
