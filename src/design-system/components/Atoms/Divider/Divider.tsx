import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type DividerProps = ComponentPropsWithoutRef<'hr'>;

export const Divider: React.FC<DividerProps> = ({ className, ...props }) => (
  <hr {...props} className={cn('h-px w-full border-0 bg-secondary-dark', className)} />
);
