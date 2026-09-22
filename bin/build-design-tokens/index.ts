#!/usr/bin/env node

import type { Config, File, TransformedToken } from 'style-dictionary';

import StyleDictionary from 'style-dictionary';

import './formats/register';
import './transforms/register';


const defaultFilter = (token: TransformedToken) => token.type !== 'scale';

const filterExcludesCategories = (token: TransformedToken, categories: string[]): boolean =>
  token?.attributes?.category ? !categories.includes(token.attributes.category) : false;

const sdConfigs: Config[] = [
  {
    source: ['src/design-system/designTokens/**/!(*.desktop).tokens.json'],
    platforms: {
      'css/variables': {
        buildPath: './src/design-system/styles/',
        transforms: ['attribute/cti', 'name/cti/kebab', 'name/cti/kebab-only-category-item', 'math', 'size/px'],
        files: [
          {
            format: 'css/variables',
            filter: (token): boolean => defaultFilter(token) && filterExcludesCategories(token, ['asset', 'breakpoint']),
            destination: '_token-custom-properties.scss',
          },
        ],
      },
      'scss/variables': {
        buildPath: './src/design-system/styles/',
        transforms: ['attribute/cti'],
        files: [
          {
            format: 'scss/map-deep',
            filter: (token): boolean => defaultFilter(token) && token?.attributes?.category === 'color',
            destination: 'abstracts/variables/_variables.scss',
            mapName: 'variables',
          } as File,
        ],
      },
      'scss/token-variables': {
        buildPath: './src/design-system/styles/',
        transforms: ['attribute/cti', 'name/cti/kebab', 'name/cti/kebab-only-category-item'],
        files: [
          {
            format: 'scss/map-deep-with-css-variables',
            filter: (token): boolean => defaultFilter(token) && filterExcludesCategories(token, ['asset']),
            destination: 'abstracts/variables/_token-variables.scss',
          },
        ],
        options: {
          categoriesWithNotCssVariables: ['breakpoint'],
        },
      },
      'typescript/token-variables': {
        buildPath: './src/design-system/',
        transforms: ['attribute/cti', 'math', 'size/px'],
        files: [
          {
            format: 'typescript/object',
            filter: defaultFilter,
            destination: 'constants/tokenVariables.ts',
          },
        ],
      },
    },
  },
  {
    include: ['src/design-system/designTokens/**/!(*.desktop).tokens.json'],
    source: ['src/design-system/designTokens/**/*.desktop.tokens.json'],
    platforms: {
      'css/variables': {
        buildPath: './src/design-system/styles/',
        transforms: ['attribute/cti', 'name/cti/kebab', 'name/cti/kebab-only-category-item', 'math', 'size/px'],
        files: [
          {
            format: 'css/variables',
            filter: (token): boolean => defaultFilter(token) && filterExcludesCategories(token, ['asset', 'breakpoint']),
            destination: '_token-custom-properties-desktop.scss',
            options: {
              mediaQuery: 'md',
            },
          },
        ],
      },
      'typescript/token-variables': {
        buildPath: './src/design-system/',
        transforms: ['attribute/cti', 'math', 'size/px'],
        files: [
          {
            format: 'typescript/object',
            filter: defaultFilter,
            destination: 'constants/tokenVariablesDesktop.ts',
          },
        ],
      },
    },
  },
];

for (const sdConfig of sdConfigs) {
  StyleDictionary.extend(sdConfig).buildAllPlatforms();
}
