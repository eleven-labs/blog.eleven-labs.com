import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

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

export interface TextProps extends useRender.ComponentProps<'p'>, VariantProps<typeof textVariants> {}

export const Text: React.FC<TextProps> = ({ render, size, className, ...props }) =>
  useRender({
    defaultTagName: 'p',
    render,
    props: { ...props, className: cn(textVariants({ size }), className) },
  });
