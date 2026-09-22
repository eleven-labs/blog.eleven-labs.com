import type { TypographySystemProps } from '@/design-system/types';

export const typographySystemProps: Record<keyof TypographySystemProps, readonly string[]> = {
  textAlign: ['text-align'],
  textSize: ['font-size', 'line-height'],
  fontWeight: ['font-weight'],
  italic: ['font-style'],
  underline: ['text-decoration'],
  textTransform: ['text-transform'],
  lineClamp: ['-webkit-line-clamp'],
};
