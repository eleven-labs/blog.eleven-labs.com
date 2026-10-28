import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

import { designSystem } from './eslint.design-system.mjs';

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
      // Les composants du design system injectent le contenu dans l'élément passé à `render` :
      // `<Button render={<a href="…" />}>Libellé</Button>` rend bien un lien libellé, mais le
      // plugin ne voit que la balise vide.
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/heading-has-content': 'off',
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
  // Classes Tailwind et conventions du design system ; 'warn' pendant la migration, 'error' au dernier lot
  ...designSystem({
    entryPoint: 'src/styles.css',
    level: 'warn',
    // eslint-plugin-react 7 ne charge pas sous ESLint 10 : un composant par fichier est vérifié par l'audit du skill
    oneComponentPerFile: false,
    externalClasses: [
      // Le HTML issu du markdown porte des classes qui ne sont pas des utilitaires Tailwind.
      'post-content(-table)?',
      'reminder-.*',
      'mermaid',
      // La carte d'un tweet, et la classe attendue par le script de Twitter pour la transformer en tweet intégré.
      '(twitter-)?tweet',
      // Classes du formulaire Webmecanik, dont le balisage ne nous appartient pas.
      'mauticform.*',
      'btn(-default)?',
    ],
  }).map((config) => ({ ...config, files: config.files.map((pattern) => pattern.replace('**/', 'src/**/')) })),
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
    ignores: [
      'coverage/**',
      'dist/**',
      'eslint.config.mjs',
      'node_modules/**',
      'public/**',
      'storybook-static/**',
      // Générés par svgr et style-dictionary (cf. le script build:design-system)
      'src/design-system/components/Atoms/Svgs/**',
      'src/design-system/constants/tokenVariables.ts',
      'src/design-system/constants/tokenVariablesDesktop.ts',
    ],
  },
];
