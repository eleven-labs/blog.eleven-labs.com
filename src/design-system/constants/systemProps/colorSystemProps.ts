import type { ColorSystemProps } from '@/design-system/types';

export const colorSystemProps: Record<keyof ColorSystemProps, readonly string[]> = {
  bg: ['background-color'],
  color: ['color'],
};
