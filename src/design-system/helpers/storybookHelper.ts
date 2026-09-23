import type { ArgTypes, InputType } from '@storybook/csf';

import { tokenVariables, tokenVariablesDesktop } from '@/design-system/constants';
import { get } from '@/design-system/helpers/objectHelper';

import { kebabCase } from './stringHelper';

export const getLinkMdnByCssProperty = (cssProperty: string): string =>
  `https://developer.mozilla.org/en-US/docs/Web/CSS/${cssProperty}`;

export const createDescription = (options: { cssProperties: string[]; cssValues?: string[] }): string => {
  const description: string[] = [];
  const cssProps = options.cssProperties
    .map((cssProp) => kebabCase(cssProp))
    .map((cssProp) => ` [${cssProp}](${getLinkMdnByCssProperty(cssProp)})`)
    .join(', ');

  let cssPropertiesDescription = `**CSS Properties**: ${cssProps}`;
  if (options.cssValues) {
    cssPropertiesDescription += ` \`(${options.cssValues.join(' | ')})\``;
  }

  description.push(cssPropertiesDescription);

  return description.join('<br />');
};

type ControlType = NonNullable<InputType['control']>;

export const createControls = <T>(parameters: {
  category: string;
  props: Record<keyof T, readonly string[]>;
  subCategory?: string;
  controlType?: Partial<Record<keyof T, ControlType>>;
  options?: Partial<Record<keyof T, readonly string[]>> | readonly string[];
}): Partial<ArgTypes<T>> =>
  (Object.entries(parameters.props) as [keyof T, string[]][]).reduce<Partial<ArgTypes<T>>>(
    (controls, [propName, cssProperties]) => {
      controls[propName] = {
        description: createDescription({
          cssProperties,
        }),
        table: {
          category: parameters.category,
        },
      };

      if (parameters.subCategory) {
        controls[propName]!.table!.subcategory = parameters.subCategory;
      }

      if (parameters.controlType) {
        (controls[propName] as InputType).control = parameters.controlType?.[propName];
      }

      if (parameters.options) {
        if (Array.isArray(parameters.options)) {
          (controls[propName] as InputType).options = parameters.options;
        } else if ((parameters.options as Record<keyof T, readonly string[]>)?.[propName]) {
          (controls[propName] as InputType).options = (parameters.options as Record<keyof T, readonly string[]>)[
            propName
          ];
        }

        if (!controls[propName]?.control) {
          (controls[propName] as InputType).control = 'select';
        }
      }

      return controls;
    },
    {}
  );

export const getValueOfCssPropertyInDesignTokens = (options: {
  path: string;
  tokenName: string;
  propertyCSS: string;
  isDesktop?: boolean;
}): number | string =>
  get(
    options.isDesktop ? tokenVariablesDesktop : tokenVariables,
    `${options.path}.${options.tokenName}.${options.propertyCSS}.value`
  ) ||
  get(tokenVariables, `${options.path}.${options.tokenName}.${options.propertyCSS}.value`) ||
  get(tokenVariables, `${options.path}.base.${options.propertyCSS}.value`);
