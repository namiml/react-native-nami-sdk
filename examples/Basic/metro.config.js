const path = require('path');

const thirdPartyPath = path.resolve(__dirname + '/../Basic/'); // Path of your local module

const thirdParty = {
  'react-native-nami-sdk': thirdPartyPath,
};
const watchFolders = [thirdPartyPath];

module.exports = {
  // existing dependencies
  resolver: {
    thirdParty,
  },
  watchFolders,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
