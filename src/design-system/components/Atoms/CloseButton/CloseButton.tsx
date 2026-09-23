import type { VariantProps } from 'class-variance-authority';

import type { ComponentPropsWithoutRef } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export const closeButtonVariants = cva('relative flex flex-col gap-xxs bg-transparent', {
  variants: {
    variant: {
      primary: 'size-[30px] [--close-button-color:var(--color-primary)]',
      secondary: 'size-[20px] [--close-button-color:var(--color-grey)]',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface CloseButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof closeButtonVariants> {}

const lineClassName = 'absolute top-1/2 left-0 h-[2px] w-full bg-(--close-button-color)';

export const CloseButton: React.FC<CloseButtonProps> = ({ variant, className, ...props }) => (
  <button type="button" {...props} className={cn(closeButtonVariants({ variant }), className)}>
    <div className={cn(lineClassName, 'rotate-45')} />
    <div className={cn(lineClassName, '-rotate-45')} />
  </button>
);
