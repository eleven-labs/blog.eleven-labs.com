import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';

export type BurgerButtonProps = ComponentPropsWithoutRef<'button'>;

/** Bouton d'ouverture du menu, trois traits superposés. Son nom accessible est « Menu », modifiable par `aria-label`. */
export const BurgerButton: React.FC<BurgerButtonProps> = ({ className, ...props }) => (
  <button type="button" aria-label="Menu" {...props} className={cn('burger-button', className)}>
    <span className="burger-button-line" aria-hidden="true" />
    <span className="burger-button-line" aria-hidden="true" />
    <span className="burger-button-line" aria-hidden="true" />
  </button>
);
