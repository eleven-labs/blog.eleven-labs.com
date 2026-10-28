import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Une étape du fil d'Ariane : un `BreadcrumbLink` ou la `BreadcrumbPage` courante. */
export function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('breadcrumb-item', className)} {...props} />;
}
