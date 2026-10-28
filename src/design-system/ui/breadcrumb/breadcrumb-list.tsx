import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Liste ordonnée des étapes du fil d'Ariane. */
export function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return <ol className={cn('breadcrumb-list', className)} {...props} />;
}
