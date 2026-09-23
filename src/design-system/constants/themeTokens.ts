import type { IconNameType } from '@/design-system/types';

import { Svgs } from '@/design-system/components/Atoms';
import { kebabCase } from '@/design-system/helpers/stringHelper';

/**
 * Le thème vit dans `styles/theme.css` : ces listes n'en répètent que les noms, pour donner à la
 * documentation un ordre de lecture. Les valeurs, elles, sont relues dans la feuille de style.
 */
export const colorTokenNameList = [
  'primary',
  'primary-dark',
  'primary-very-dark',
  'secondary',
  'secondary-dark',
  'info',
  'accent',
  'ultra-light-grey',
  'light-grey',
  'grey',
  'dark-grey',
  'ultra-dark-grey',
  'black',
  'white',
] as const;

export const spacingTokenNameList = [
  'xxs-3',
  'xxs-2',
  'xxs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl',
  'xxl-2',
  'xxl-3',
] as const;

export const radiusTokenNameList = ['xs', 's', 'full-rounded'] as const;

export const fontFamilyTokenNameList = ['base', 'heading', 'blockquote'] as const;

export const lineHeightTokenNameList = ['base', 'large'] as const;

export const breakpointTokenNameList = ['sm', 'md', 'lg'] as const;

export const fontWeightList = [
  { name: 'normal', value: '400' },
  { name: 'medium', value: '500' },
  { name: 'semibold', value: '600' },
  { name: 'bold', value: '700' },
] as const;

export const markupSizeList = ['s', 'm', 'l', 'xl'] as const;

export const iconNameList = Object.keys(Svgs).map((svgName) => kebabCase(svgName)) as IconNameType[];

export type ThemeTokenValues = {
  /** Valeurs lues en dessous de `md`. */
  base: Record<string, string>;
  /** Les mêmes, complétées par celles redéfinies au-delà de `md`. */
  desktop: Record<string, string>;
};

/**
 * Relit les propriétés personnalisées posées sur `:root` par la feuille de style, au palier mobile
 * comme au palier bureau. La documentation affiche ainsi ce que le navigateur applique vraiment,
 * plutôt qu'une copie des valeurs qui pourrait diverger.
 */
export const readThemeTokens = (): ThemeTokenValues => {
  const base: Record<string, string> = {};
  const desktop: Record<string, string> = {};

  const collect = (style: CSSStyleDeclaration, target: Record<string, string>): void => {
    for (const property of Array.from(style)) {
      if (property.startsWith('--')) {
        target[property] = style.getPropertyValue(property).trim();
      }
    }
  };

  const visit = (rules: CSSRuleList, target: Record<string, string>): void => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSMediaRule) {
        visit(rule.cssRules, rule.conditionText.includes('1001') ? desktop : target);
      } else if (rule instanceof CSSStyleRule) {
        if (rule.selectorText.includes(':root')) {
          collect(rule.style, target);
        }
      } else if ('cssRules' in rule) {
        visit((rule as CSSGroupingRule).cssRules, target);
      }
    }
  };

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules, base);
    } catch {
      // Une feuille servie par un autre domaine n'est pas lisible : rien à en tirer ici.
    }
  }

  return { base, desktop: { ...base, ...desktop } };
};
