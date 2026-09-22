import type { MarginSystemProps, PaddingSystemProps, SpacingSystemProps } from '@/design-system/types';

export const paddingSystemProps: Record<keyof PaddingSystemProps, readonly string[]> = {
  p: ['padding'],
  pt: ['padding-top'],
  pr: ['padding-right'],
  pl: ['padding-left'],
  pb: ['padding-bottom'],
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],
};

export const marginSystemProps: Record<keyof MarginSystemProps, readonly string[]> = {
  m: ['margin'],
  mt: ['margin-top'],
  mr: ['margin-right'],
  ml: ['margin-left'],
  mb: ['margin-bottom'],
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
};

export const spacingSystemProps: Record<keyof SpacingSystemProps, readonly string[]> = {
  ...marginSystemProps,
  ...paddingSystemProps,
};
