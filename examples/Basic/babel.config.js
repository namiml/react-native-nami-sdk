module.exports = {
  presets: [
    [
      '@react-native/babel-preset',
      {
        unstable_enablePackageExports: true,
      },
    ],
  ],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
};
