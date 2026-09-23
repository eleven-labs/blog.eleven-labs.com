import type { VariantProps } from 'class-variance-authority';

import type { ElementTagName, PolymorphicProps } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      s: 'text-s',
      m: 'text-m',
    },
  },
});

export interface TextOwnProps extends VariantProps<typeof textVariants> {
  className?: string;
  children?: React.ReactNode;
}

export type TextProps<TTagName extends ElementTagName = 'p'> = PolymorphicProps<TTagName, TextOwnProps>;

export const Text = <TTagName extends ElementTagName = 'p'>({
  as,
  size,
  className,
  children,
  ...props
}: TextProps<TTagName>): React.JSX.Element => {
  const Tag = (as ?? 'p') as React.ElementType;

  return (
    <Tag {...props} className={cn(textVariants({ size }), className)}>
      {children}
    </Tag>
  );
};
