import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type BlockquoteProps = Omit<ComponentPropsWithoutRef<'blockquote'>, 'align'>;

export const Blockquote: React.FC<BlockquoteProps> = ({ children, className, ...props }) => (
  <blockquote
    {...props}
    className={cn(
      'pl-m font-blockquote text-m italic',
      // Les guillemets ouvrants et fermants, le second étant le premier retourné.
      "before:block before:h-20 before:text-[8rem] before:font-medium before:text-primary before:content-['“']",
      "after:block after:h-20 after:rotate-180 after:text-[8rem] after:font-medium after:text-primary after:content-['“']",
      className
    )}
  >
    {children}
  </blockquote>
);
