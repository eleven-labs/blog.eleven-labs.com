import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { polyRef } from '@/design-system/helpers/polyRef';

export const headingVariants = cva('font-heading tracking-normal', {
  variants: {
    size: {
      /* Seule taille composée dans la police de labeur plutôt que dans celle des titres. */
      xs: 'font-base text-heading-xs font-semibold',
      s: 'text-heading-s font-bold',
      m: 'text-heading-m font-bold',
      l: 'text-heading-l',
      xl: 'text-heading-xl font-normal tracking-heading-xl uppercase',
    },
  },
});

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  className?: string;
  children?: React.ReactNode;
}

export const Heading = polyRef<'p', HeadingProps>(({ as: As = 'p', size, className, children, ...props }, ref) => (
  <As {...props} ref={ref} className={cn(headingVariants({ size }), className)}>
    {children}
  </As>
));

Heading.displayName = 'Heading';
