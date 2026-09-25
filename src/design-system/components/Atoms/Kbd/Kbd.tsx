import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type KbdProps = ComponentPropsWithoutRef<'kbd'>;

export const Kbd: React.FC<KbdProps> = ({ children, className, ...props }) => (
  <kbd
    {...props}
    className={cn(
      'rounded-xs border border-light-grey bg-ultra-light-grey px-xxs py-xxs-3 text-xs font-semibold text-ultra-dark-grey',
      className
    )}
  >
    {children}
  </kbd>
);
