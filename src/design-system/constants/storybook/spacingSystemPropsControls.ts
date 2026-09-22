import type { ArgTypes } from '@storybook/csf';

import type { MarginSystemProps, PaddingSystemProps, SpacingSystemProps } from '@/design-system/types';

import { spacingTokenNameList , paddingSystemProps, spacingSystemProps } from '@/design-system/constants';
import { createControls } from '@/design-system/helpers/storybookHelper';

export const marginSystemPropsControls = createControls<MarginSystemProps>({
  category: 'Spacing System Props',
  subCategory: 'Margin System Props',
  props: spacingSystemProps,
  options: spacingTokenNameList,
});

export const paddingSystemPropsControls = createControls<PaddingSystemProps>({
  category: 'Spacing System Props',
  subCategory: 'Padding System Props',
  props: paddingSystemProps,
  options: spacingTokenNameList,
});

export const spacingSystemPropsControls: Partial<ArgTypes<SpacingSystemProps>> = {
  ...marginSystemPropsControls,
  ...paddingSystemPropsControls,
};
