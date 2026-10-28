import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import { cn } from '@/design-system/helpers/cn';

/** Filet de séparation, horizontal par défaut (remplace l'ancien `Divider`). */
export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorPrimitive.Props) {
  return <SeparatorPrimitive orientation={orientation} className={cn('separator', className)} {...props} />;
}
