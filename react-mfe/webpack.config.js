// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const defaultConfig = {
  mode: 'development',
  entry: {
    main: './src/index.tsx',
    'react-single-spa': './src/single-spa-entry.tsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:4202/',
    clean: true,
    libraryTarget: 'umd',
    library: '[name]'
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
    // Module Federation disabled for now - using direct UMD loading
    // new ModuleFederationPlugin({
    //   name: 'reactMfe',
    //   filename: 'remoteEntry.js',
    //   exposes: {
    //     './App': './src/bootstrap'
    //   },
    //   shared: {
    //     'react': { singleton: true },
    //     'react-dom': { singleton: true }
    //   }
    // }),
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
  }
};

module.exports = defaultConfig;