import { ChevronRightIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Séparateur entre deux étapes (décoratif) : un chevron, ou le contenu passé en enfant. */
export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li role="presentation" aria-hidden="true" className={cn('breadcrumb-separator', className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  );
}
