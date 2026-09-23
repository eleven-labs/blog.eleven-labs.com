import type { VariantProps } from 'class-variance-authority';

import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const buttonVariants = cva(
  'inline-flex flex-row items-center justify-center rounded-[100px] border-transparent px-m py-xs font-heading text-s font-bold tracking-[1px] uppercase disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'border-0 bg-info text-white disabled:bg-dark-grey',
        secondary: 'border-2 bg-white text-info hover:border-info disabled:border-dark-grey',
        accent: 'border-0 bg-accent text-primary',
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
