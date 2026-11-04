import { MoreHorizontalIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

export interface PaginationEllipsisProps extends React.ComponentProps<'span'> {
  /** Libellé pour les lecteurs d'écran. */
  label?: string;
}

/** Pages omises : l'icône est décorative, le libellé est lu par les lecteurs d'écran. */
export function PaginationEllipsis({ className, label = 'Pages suivantes', ...props }: PaginationEllipsisProps) {
  return (
    <span className={cn('pagination-ellipsis', className)} {...props}>
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
