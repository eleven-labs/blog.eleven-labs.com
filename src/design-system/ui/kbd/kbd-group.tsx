import { cn } from '@/design-system/helpers/cn';

/** Combinaison de touches : plusieurs `Kbd` côte à côte. */
export function KbdGroup({ className, ...props }: React.ComponentProps<'kbd'>) {
  return <kbd className={cn('kbd-group', className)} {...props} />;
}
