module.exports = {
  dependencies: {
    'react-native-nami-sdk': {
      root: __dirname,
    },
  },
  codegenConfig: {
    name: 'Nami',
    type: 'modules',
    jsSrcsDir: './specs',
  },
};
