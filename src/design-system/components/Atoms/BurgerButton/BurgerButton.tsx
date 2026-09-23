import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type BurgerButtonProps = ComponentPropsWithoutRef<'button'>;

export const BurgerButton: React.FC<BurgerButtonProps> = ({ className, ...props }) => (
  <button type="button" {...props} className={cn('flex flex-col gap-xxs bg-transparent', className)}>
    <div className="h-[2px] w-[30px] bg-primary" />
    <div className="h-[2px] w-[30px] bg-primary" />
    <div className="h-[2px] w-[30px] bg-primary" />
  </button>
);
