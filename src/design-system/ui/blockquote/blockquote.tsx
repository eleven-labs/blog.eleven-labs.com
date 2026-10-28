import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type BlockquoteProps = Omit<ComponentPropsWithoutRef<'blockquote'>, 'align'>;

/** Citation en italique, encadrée de grands guillemets de la couleur de la marque (voir blockquote.css). */
export const Blockquote: React.FC<BlockquoteProps> = ({ children, className, ...props }) => (
  <blockquote {...props} className={cn('blockquote', className)}>
    {children}
  </blockquote>
);
