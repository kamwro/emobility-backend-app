// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'src/migrations/**'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  ...compat.env({
    node: true,
    jest: true,
  }),
  {
    files: ['**/*.ts'],
    languageOptions: {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      prettier: require('eslint-plugin-prettier'),
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      security: require('eslint-plugin-security'),
    },
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
      semi: ['error', 'always'],
      'no-empty': 'warn',
      'no-unused-expressions': ['error', { allowTernary: true }],
      'no-use-before-define': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
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
  },
];
