module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {
    'prettier/prettier': 'error',

    // React Native specific
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'react/prop-types': 'off',

    // TS tweaks
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    "@typescript-eslint/no-explicit-any": "off",
    'no-unused-vars': 'off',
  },
};
