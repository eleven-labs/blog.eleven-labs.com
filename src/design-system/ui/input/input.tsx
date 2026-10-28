import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/** Champ de saisie sur une ligne. Son nom accessible vient d'un `<label>` ou de `aria-label`. */
export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <InputPrimitive type={type} className={cn('input', className)} {...props} />;
}
