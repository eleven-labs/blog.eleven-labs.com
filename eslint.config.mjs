import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

const files = ['src/**/*.{ts,tsx}', 'bin/**/*.ts'];

export default [
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    files,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          project: ['./tsconfig.json', './tsconfig.node.json'],
        },
      },
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files,
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'external-type-group',
            'internal-type-group',
            'external-value-group',
            'internal-value-group',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'side-effect',
          ],
          customGroups: {
            type: {
              'external-type-group': ['^(?!@/).*'],
              'internal-type-group': ['^@/.*'],
            },
            value: {
              'external-value-group': ['^(?!@/|\\.|/).*'],
              'internal-value-group': ['^@/.*'],
            },
          },
          internalPattern: ['^@/.*'],
          matcher: 'regex',
          newlinesBetween: 'always',
          type: 'natural',
        },
      ],
    },
  },
  {
    ignores: ['coverage/**', 'dist/**', 'eslint.config.mjs', 'node_modules/**', 'public/**', 'storybook-static/**'],
  },
];
