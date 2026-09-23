import type { LayoutSystemProps } from '@/design-system/types';

export const layoutSystemProps: Record<keyof LayoutSystemProps, readonly string[]> = {
  display: ['display'],
  width: ['width'],
  height: ['height'],
  hiddenBelow: ['display'],
  hiddenAbove: ['display'],
};
