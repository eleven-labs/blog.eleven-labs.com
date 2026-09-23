import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/design-system/helpers/cn';

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

export interface HeadingProps extends useRender.ComponentProps<'p'>, VariantProps<typeof headingVariants> {}

export const Heading: React.FC<HeadingProps> = ({ render, size, className, ...props }) =>
  useRender({
    defaultTagName: 'p',
    render,
    props: { ...props, className: cn(headingVariants({ size }), className) },
  });
