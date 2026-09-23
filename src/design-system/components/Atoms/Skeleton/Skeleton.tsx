import type { ComponentPropsWithoutRef } from '@/design-system/types';

import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  /** À `false`, le contenu est rendu tel quel, sans habillage. */
  isLoading?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ isLoading = true, className, children, ...props }) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div
      {...props}
      // Le contenu reste en place pour donner sa taille au bloc, mais n'est plus visible.
      className={cn('animate-pulse bg-ultra-light-grey *:invisible *:cursor-default', className)}
    >
      {children ?? <div>&nbsp;</div>}
    </div>
  );
};
