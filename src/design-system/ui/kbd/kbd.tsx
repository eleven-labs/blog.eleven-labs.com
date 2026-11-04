import { cn } from '@/design-system/helpers/cn';

/** Touche du clavier, dans le texte (`Ctrl`, `Maj`…). */
export function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return <kbd className={cn('kbd', className)} {...props} />;
}
