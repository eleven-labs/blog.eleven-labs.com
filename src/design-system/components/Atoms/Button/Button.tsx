import type { VariantProps } from 'class-variance-authority';

import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const buttonVariants = cva(
  'inline-flex flex-row items-center justify-center rounded-full border-transparent px-6 py-3 font-display body-s font-bold tracking-wider uppercase disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'border-0 bg-primary text-on-primary disabled:bg-muted',
        secondary: 'border-2 bg-surface text-primary hover:border-primary disabled:border-muted',
        accent: 'border-0 bg-highlight text-brand',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonProps extends useRender.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}

export const Button: React.FC<ButtonProps> = ({ render, variant = 'primary', className, children, ...props }) =>
  useRender({
    defaultTagName: 'button',
    render,
    props: {
      ...props,
      'data-text': typeof children === 'string' ? children : '',
      className: cn(buttonVariants({ variant }), className),
      children: (
        <>
          {/* La flèche précède le libellé, retournée, quand le bouton ramène en arrière. */}
          {variant === 'secondary' && <Icon name="arrow" style={{ transform: 'scaleX(-1)' }} />}
          <Text render={<span />}>{children}</Text>
          {variant !== 'secondary' && <Icon name="arrow" />}
        </>
      ),
    },
  });
