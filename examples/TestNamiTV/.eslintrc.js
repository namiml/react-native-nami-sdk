module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 0,
    quotes: ['error', 'single'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'react/prop-types': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off', //it makes sense to enable this rule
    '@typescript-eslint/no-unused-vars': [
      2,
      { args: 'none', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', //it makes sense to enable this rule
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    'react/jsx-first-prop-new-line': [1, 'multiline'],
    'react/jsx-max-props-per-line': [
      1,
      {
        maximum: 1,
      },
    ],
    'no-unused-vars': 'off',
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'object-curly-spacing': ['error', 'always'],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
