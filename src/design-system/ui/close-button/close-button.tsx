import type { VariantProps } from 'class-variance-authority';

import type { ComponentPropsWithoutRef } from '@/design-system/types';

import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export const closeButtonVariants = cva('close-button', {
  variants: {
    variant: {
      primary: 'close-button-primary',
      secondary: 'close-button-secondary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface CloseButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof closeButtonVariants> {}

/**
 * Bouton de fermeture en croix (menu, champ de recherche). Son nom accessible est « Fermer »,
 * modifiable par `aria-label`.
 */
export const CloseButton: React.FC<CloseButtonProps> = ({ variant, className, ...props }) => (
  <button type="button" aria-label="Fermer" {...props} className={cn(closeButtonVariants({ variant }), className)}>
    <span className="close-button-line close-button-line-up" aria-hidden="true" />
    <span className="close-button-line close-button-line-down" aria-hidden="true" />
  </button>
);
