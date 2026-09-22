import type { FlexOrGridSystemProps } from '@/design-system/types';

export const flexOrGridSystemProps: Record<keyof FlexOrGridSystemProps, readonly string[]> = {
  alignItems: ['align-items'],
  alignContent: ['align-content'],
  justifyContent: ['justify-content'],
  gap: ['gap'],
  gapX: ['row-gap'],
  gapY: ['col-gap'],
};
