import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import tailwindcss from 'eslint-plugin-tailwindcss';
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
  { ...tailwindcss.configs.recommended, files },
  {
    files,
    settings: {
      tailwindcss: {
        // Le thème étant décrit en CSS, le plugin a besoin du point d'entrée pour connaître les
        // classes valides, y compris celles issues de `@theme` et de `@utility`.
        cssConfigPath: './src/styles.css',
      },
    },
    rules: {
      // Le HTML issu du markdown porte des classes qui ne sont pas des utilitaires Tailwind.
      'tailwindcss/no-custom-classname': [
        'error',
        {
          whitelist: [
            'post\\-content(\\-table)?',
            'reminder\\-\\-[a-z]+',
            'reminder\\-title',
            'mermaid',
            // Classe attendue par le script de Twitter pour transformer la citation en tweet intégré.
            'twitter\\-tweet',
            // Classes du formulaire Webmecanik, dont le balisage ne nous appartient pas.
            'mauticform.*',
            'btn(\\-default)?',
          ],
        },
      ],
    },
  },
  {
    // Le helper `cn` passe une variable aux fonctions que le plugin sait lire : il n'a rien à
    // analyser ici.
    files: ['src/design-system/helpers/cn.ts'],
    rules: {
      'tailwindcss/no-custom-classname': 'off',
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
