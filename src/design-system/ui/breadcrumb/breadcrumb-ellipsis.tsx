import { MoreHorizontalIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

export interface BreadcrumbEllipsisProps extends React.ComponentProps<'span'> {
  /** Libellé pour les lecteurs d'écran. */
  label?: string;
}

/** Étapes masquées du fil d'Ariane : l'icône est décorative, le libellé est lu par les lecteurs d'écran. */
export function BreadcrumbEllipsis({ className, label = 'Plus', ...props }: BreadcrumbEllipsisProps) {
  return (
    <span className={cn('breadcrumb-ellipsis', className)} {...props}>
      <MoreHorizontalIcon aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
