const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const path = require('path');

module.exports = (config, options) => {
  // Basic webpack config without Module Federation for now
  // We'll use dynamic loading instead
  config.output = {
    ...config.output,
    uniqueName: 'angularShell',
    publicPath: 'auto'
  };

  return config;
};