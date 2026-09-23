import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { polyRef } from '@/design-system/helpers/polyRef';

export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      s: 'text-s',
      m: 'text-m',
    },
  },
});

export interface TextProps extends VariantProps<typeof textVariants> {
  className?: string;
  children?: React.ReactNode;
}

export const Text = polyRef<'p', TextProps>(({ as: As = 'p', size, className, children, ...props }, ref) => (
  <As {...props} ref={ref} className={cn(textVariants({ size }), className)}>
    {children}
  </As>
));

Text.displayName = 'Text';
