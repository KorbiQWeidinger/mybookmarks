import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Console and debugging
      'no-console': ['error', { allow: ['error'] }],
      'no-debugger': 'warn',

      // Code quality
      'no-var': 'warn',
      'prefer-const': 'warn',
      'dot-notation': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'require-await': 'warn',
      'no-return-await': 'warn',

      // Style
      'no-nested-ternary': 'warn',
      'spaced-comment': ['warn', 'always'],
      'linebreak-style': 0,

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
    },
  }
);
