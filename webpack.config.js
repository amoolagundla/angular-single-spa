const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const path = require('path');

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
    filename: 'main-single-spa.js',
    libraryTarget: 'system',
    path: path.resolve(__dirname, 'dist/angular-spa-app')
  };

  singleSpaWebpackConfig.externals = [
    'zone.js',
  ];

  return singleSpaWebpackConfig;
};