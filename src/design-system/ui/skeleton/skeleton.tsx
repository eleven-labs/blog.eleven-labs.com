import { cn } from '@/design-system/helpers/cn';

export interface SkeletonProps extends React.ComponentProps<'div'> {
  /** À `false`, le contenu est rendu tel quel, sans habillage. */
  isLoading?: boolean;
}

/** Squelette de chargement : le contenu reste en place pour donner sa taille au bloc, mais n'est plus visible. */
export function Skeleton({ isLoading = true, className, children, ...props }: SkeletonProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div aria-busy="true" className={cn('skeleton', className)} {...props}>
      {children ?? <div>&nbsp;</div>}
    </div>
  );
}
