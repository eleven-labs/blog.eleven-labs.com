import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type KbdProps = ComponentPropsWithoutRef<'kbd'>;

export const Kbd: React.FC<KbdProps> = ({ children, className, ...props }) => (
  <kbd
    {...props}
    className={cn(
      'rounded-card border border-line-strong bg-surface-alt px-2 py-1 body-xs font-semibold text-ink-soft',
      className
    )}
  >
    {children}
  </kbd>
);
