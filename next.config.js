const withCSS = require('@zeit/next-css');

const assetPrefix = process.env.NODE_ENV === 'production' ? '/tilt' : '';

module.exports = withCSS({
  assetPrefix,
  publicRuntimeConfig: {
    assetPrefix,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]',
        },
      },
    });
    return config;
  },
});
