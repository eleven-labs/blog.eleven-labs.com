import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Liste des cases de la pagination. */
export function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('pagination-content', className)} {...props} />;
}
