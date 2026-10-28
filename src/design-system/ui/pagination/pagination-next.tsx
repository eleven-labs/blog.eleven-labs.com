import * as React from 'react';

import { Icon } from '@/design-system/ui/icon';

import { PaginationLink } from './pagination-link';

export interface PaginationNextProps extends React.ComponentProps<typeof PaginationLink> {
  /** Nom accessible du lien (la case n'affiche que la flèche). */
  label?: string;
}

/** Case « page suivante » : flèche seule. */
export function PaginationNext({ label = 'Page suivante', ...props }: PaginationNextProps) {
  return (
    <PaginationLink aria-label={label} {...props}>
      <Icon name="arrow" aria-hidden="true" />
    </PaginationLink>
  );
}
