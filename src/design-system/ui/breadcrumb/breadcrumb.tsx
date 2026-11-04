import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Fil d'Ariane : `<nav>` qui contient une `BreadcrumbList`. Le nom accessible se traduit par `aria-label`. */
export function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="Fil d'Ariane" className={cn(className)} {...props} />;
}
