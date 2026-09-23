import type { VariantProps } from 'class-variance-authority';

import type { ElementTagName, PolymorphicProps } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import * as React from 'react';

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

export interface HeadingOwnProps extends VariantProps<typeof headingVariants> {
  className?: string;
  children?: React.ReactNode;
}

export type HeadingProps<TTagName extends ElementTagName = 'p'> = PolymorphicProps<TTagName, HeadingOwnProps>;

export const Heading = <TTagName extends ElementTagName = 'p'>({
  as,
  size,
  className,
  children,
  ...props
}: HeadingProps<TTagName>): React.JSX.Element => {
  const Tag = (as ?? 'p') as React.ElementType;

  return (
    <Tag {...props} className={cn(headingVariants({ size }), className)}>
      {children}
    </Tag>
  );
};
