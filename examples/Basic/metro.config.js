const path = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');

// const reactNativeLib = path.resolve(__dirname, '..');

module.exports = {
  // watchFolders: [path.resolve(__dirname, 'node_modules'), reactNativeLib],
  resolver: {
    blacklistRE: blacklist([
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip
      /.*\.ProjectImports\.zip/,
      /(.*\/react-native-video\/node_modules\/.*)$/,
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
