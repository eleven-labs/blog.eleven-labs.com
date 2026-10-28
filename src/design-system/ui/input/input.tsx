import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

/**
 * Champ de saisie sur une ligne. Son nom accessible vient d'un `<label>` ou de `aria-label`. `forwardRef` : en React 18,
 * une fonction ne reçoit pas la `ref` en prop (downshift en pose une sur le champ de l'autocomplétion).
 */
export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <InputPrimitive ref={ref} type={type} className={cn('input', className)} {...props} />
  )
);
Input.displayName = 'Input';
