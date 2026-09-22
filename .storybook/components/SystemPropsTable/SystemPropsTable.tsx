import { linkTo } from '@storybook/addon-links';
import React from 'react';

import { Link, Text } from '@/design-system';
import { colorSystemProps, cssProperties, spacingSystemProps, tokenVariables } from '@/design-system/constants';
import { getLinkMdnByCssProperty } from '@/design-system/helpers/storybookHelper';
import { kebabCase } from '@/design-system/helpers/stringHelper';
import { SystemProps } from '@/design-system/types';

import { Table } from '../Table';

export interface SystemPropsTableProps {
  title: string;
  systemProps: Partial<Record<keyof SystemProps, readonly string[]>>;
}

const getStoryTitleAndDesignTokenLabelByPropName = (
  propName: keyof SystemProps
): { storyTitle: string; designTokenLabel: string } | string => {
  let designTokenName = kebabCase(propName) as keyof typeof tokenVariables | keyof typeof cssProperties;

  if (Object.keys(colorSystemProps).includes(propName)) {
    designTokenName = 'color';
  }
  if (Object.keys(spacingSystemProps).includes(propName) || ['gap', 'gapX', 'gapY'].includes(propName)) {
    designTokenName = 'spacing';
  }
  if (['width'].includes(propName)) {
    designTokenName = 'width';
  }
  if (['height'].includes(propName)) {
    designTokenName = 'height';
  }

  if (propName === 'textSize') {
    return {
      storyTitle: 'Foundations/Design Tokens/Typography/Text',
      designTokenLabel: 'Text Size Token',
    };
  }

  if (['hiddenAbove', 'hiddenBelow'].includes(propName)) {
    return {
      storyTitle: 'Foundations/Design Tokens/Breakpoint',
      designTokenLabel: 'Breakpoint Token',
    };
  }

  switch (designTokenName) {
    case 'color':
      return {
        storyTitle: 'Foundations/Design Tokens/Color',
        designTokenLabel: 'Color Token',
      };
    case 'spacing':
      return {
        storyTitle: 'Foundations/Design Tokens/Spacing',
        designTokenLabel: 'Spacing Token',
      };
    case 'text-transform':
      return {
        storyTitle: 'Foundations/Css Properties/Typography/TextTransform',
        designTokenLabel: 'Text Transform Css Property',
      };
    case 'text-align':
      return {
        storyTitle: 'Foundations/Css Properties/Typography/TextAlign',
        designTokenLabel: 'Text Align Css Property',
      };
    case 'font-weight':
      return {
        storyTitle: 'Foundations/Design Tokens/Typography/FontWeight',
        designTokenLabel: 'Font Weight Token',
      };
    case 'display':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/Display',
        designTokenLabel: 'Display Token',
      };
    case 'width':
      return {
        storyTitle: 'Foundations/Design Tokens/Layout/Width',
        designTokenLabel: 'Width Token',
      };
    case 'height':
      return {
        storyTitle: 'Foundations/Design Tokens/Layout/Height',
        designTokenLabel: 'Height Token',
      };
    case 'align-content':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/AlignContent',
        designTokenLabel: 'Align Content Css Property',
      };
    case 'align-items':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/AlignItems',
        designTokenLabel: 'Align Items Css Property',
      };
    case 'align-self':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/AlignSelf',
        designTokenLabel: 'Align Self Css Property',
      };
    case 'flex-basis':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/FlexBasis',
        designTokenLabel: 'Flex Basis Css Property',
      };
    case 'flex-direction':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/FlexDirection',
        designTokenLabel: 'Flex Direction Css Property',
      };
    case 'flex-wrap':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/FlexWrap',
        designTokenLabel: 'Flex Wrap Css Property',
      };
    case 'justify-content':
      return {
        storyTitle: 'Foundations/Css Properties/Layout/FlexBox/JustifyContent',
        designTokenLabel: 'Justify Content Css Property',
      };
  }

  if (['italic', 'underline'].includes(propName)) {
    return 'true | false';
  }

  return '--';
};

export const SystemPropsTable: React.FC<SystemPropsTableProps> = ({ title, systemProps }) => (
  <Table
    title={title}
    columns={[
      {
        name: 'propName',
        label: 'Prop',
      },
      {
        name: 'cssProperties',
        label: 'CSS Properties',
      },
      {
        name: 'value',
        label: 'Reference or value',
      },
    ]}
    rows={Object.entries(systemProps).map(([propName, cssProperties]) => {
      const value = getStoryTitleAndDesignTokenLabelByPropName(propName as keyof SystemProps);
      return {
        propName,
        cssProperties: cssProperties.map((cssProperty, index) => (
          <>
            <Link href={getLinkMdnByCssProperty(cssProperty)} target="_blank">
              {cssProperty}
            </Link>
            {cssProperties.length - 1 !== index && <Text as="span">, </Text>}
          </>
        )),
        value:
          typeof value !== 'string' ? <Link onClick={linkTo(value.storyTitle)}>{value.designTokenLabel}</Link> : value,
      };
    })}
  />
);
