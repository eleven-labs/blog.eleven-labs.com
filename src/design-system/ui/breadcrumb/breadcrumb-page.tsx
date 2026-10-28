import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Page courante : texte non cliquable, annoncé comme la page en cours. */
export function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('breadcrumb-page', className)}
      {...props}
    />
  );
}
