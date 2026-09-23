import type { ArgTypes } from '@storybook/csf';

import type { SystemProps } from '@/design-system/types';

import { colorSystemPropsControls } from './colorSystemPropsControls';
import { flexItemSystemPropsControls } from './flexItemSystemPropsControls';
import { flexOrGridItemSystemPropsControls } from './flexOrGridItemSystemPropsControls';
import { layoutSystemPropsControls } from './layoutSystemPropsControls';
import { spacingSystemPropsControls } from './spacingSystemPropsControls';
import { typographySystemPropsControls } from './typographySystemPropsControls';

export const systemPropsControls: Partial<ArgTypes<SystemProps>> = {
  ...spacingSystemPropsControls,
  ...colorSystemPropsControls,
  ...layoutSystemPropsControls,
  ...flexOrGridItemSystemPropsControls,
  ...flexItemSystemPropsControls,
  ...typographySystemPropsControls,
};
