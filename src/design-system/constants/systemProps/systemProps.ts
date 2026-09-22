import type { SystemProps } from '@/design-system/types';

import { colorSystemProps } from './colorSystemProps';
import { flexItemSystemProps } from './flexItemSystemProps';
import { flexOrGridItemSystemProps } from './flexOrGridItemSystemProps';
import { layoutSystemProps } from './layoutSystemProps';
import { spacingSystemProps } from './spacingSystemProps';
import { typographySystemProps } from './typographySystemProps';

export const systemProps: Record<keyof SystemProps, readonly string[]> = {
  ...spacingSystemProps,
  ...flexOrGridItemSystemProps,
  ...colorSystemProps,
  ...typographySystemProps,
  ...layoutSystemProps,
  ...flexItemSystemProps,
};
