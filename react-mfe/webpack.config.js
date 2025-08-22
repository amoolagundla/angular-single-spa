const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'react-mfe.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    port: 4202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hot: true
  },
  // Remove externals - bundle React and ReactDOM within the microfrontend
  // externals: {}
};

module.exports = defaultConfig;