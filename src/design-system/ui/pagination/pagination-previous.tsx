import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';

import { PaginationLink } from './pagination-link';

export interface PaginationPreviousProps extends React.ComponentProps<typeof PaginationLink> {
  /** Nom accessible du lien (la case n'affiche que la flèche). */
  label?: string;
}

/** Case « page précédente » : flèche seule. */
export function PaginationPrevious({ className, label = 'Page précédente', ...props }: PaginationPreviousProps) {
  return (
    <PaginationLink aria-label={label} className={cn('pagination-previous', className)} {...props}>
      <Icon name="arrow" aria-hidden="true" />
    </PaginationLink>
  );
}
