module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    'react/no-unstable-nested-components': [
      'off' | 'warn' | 'error',
      { allowAsProps: true | false },
    ],
    'prettier/prettier': ['error', {
      bracketSpacing: true,
      jsxBracketSameLine: true,
      singleQuote: true,
      trailingComma: 'all',
      arrowParens: 'avoid',
    }, ],
    quotes: ['error', 'single'],
    indent: ['error', 2, { SwitchCase: 1 }],
    "comma-dangle": [2, "always-multiline"],
    'react/prop-types': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [2, { 'args': 'none', 'ignoreRestSiblings': true }],
    '@typescript-eslint/no-use-before-define': ['error', { 'variables': false }],
    'react/jsx-first-prop-new-line': [1, 'multiline'],
    'react/jsx-max-props-per-line': [1,
      {
        'maximum': 1,
      },
    ],
    'no-unused-vars': 'off',
    'object-curly-spacing': ['error', 'always'],
  },
};
