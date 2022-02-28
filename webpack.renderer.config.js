const rules = require('./webpack.rules');
const webpack = require('webpack');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: [
    // ignore sentry main code since it requires node apis
    new webpack.IgnorePlugin({
      resourceRegExp: /@sentry\/electron\/main/,
    }),
  ],
};
