// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pak = require('../../package.json');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            [`${pak.name}/package.json`]: path.join(
              __dirname,
              '../..',
              'package.json',
            ),
            // For development, we want to alias the library to the source
            [pak.name]: path.join(__dirname, '../..', pak.source),
          },
        },
      ],
      ['@babel/plugin-proposal-export-namespace-from'],
      ['react-native-reanimated/plugin'],
    ],
  };
};
