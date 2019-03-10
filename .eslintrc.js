module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
    browser: true,
  },
  plugins: ['import', 'prettier'],
  rules: {
    'max-len': ['error', 100],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-mixed-operators': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        printWidth: 100,
      },
    ],
  },
};
