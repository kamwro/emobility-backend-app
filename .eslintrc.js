module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'security'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-namespace': 'warn',
    'security/detect-object-injection': 'warn',
    'no-var': 'error',
    'no-console': 'warn',
    curly: 'warn',
    eqeqeq: 'warn',
    'no-throw-literal': 'warn',
    semi: 'all',
    'no-empty': 'warn',
    'no-unused-expressions': ['error', { allowTernary: true }],
    'no-use-before-define': 'off',
    '@typescript-eslint/naming-convention': [
      { selector: 'variableLike', format: ['camelCase'] },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
    ],
  },
};
