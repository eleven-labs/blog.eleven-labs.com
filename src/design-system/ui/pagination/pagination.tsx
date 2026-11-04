import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Pagination : `<nav>` qui contient une `PaginationContent`. Le nom accessible se traduit par `aria-label`. */
export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="Pagination" className={cn('pagination', className)} {...props} />;
}
