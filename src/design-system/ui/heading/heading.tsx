import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/design-system/helpers/cn';

export const headingVariants = cva('font-display tracking-normal', {
  variants: {
    size: {
      /* Seule taille composée dans la police de labeur plutôt que dans celle des titres. */
      xs: 'font-sans heading-xs font-semibold',
      s: 'heading-s font-bold',
      m: 'heading-m font-bold',
      l: 'heading-l',
      xl: 'heading-xl font-normal tracking-wider uppercase',
    },
  },
});

/** Titre de l'interface : la taille pose la police, la graisse et l'utilitaire heading-*. */
export interface HeadingProps extends useRender.ComponentProps<'p'>, VariantProps<typeof headingVariants> {}

export const Heading: React.FC<HeadingProps> = ({ render, size, className, ...props }) =>
  useRender({
    defaultTagName: 'p',
    render,
    props: { ...props, className: cn(headingVariants({ size }), className) },
  });
