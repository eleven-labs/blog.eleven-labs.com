import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { polyRef } from '@/design-system/helpers/polyRef';

export interface SkeletonProps {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = polyRef<'div', SkeletonProps>(
  ({ as: As = 'div', isLoading = true, className, children, ...props }, ref) => {
    if (!isLoading) {
      return <>{children}</>;
    }

    return (
      <As
        {...props}
        ref={ref}
        // Le contenu reste en place pour donner sa taille au bloc, mais n'est plus visible.
        className={cn('animate-pulse bg-ultra-light-grey *:invisible *:cursor-default', className)}
      >
        {children ?? <div>&nbsp;</div>}
      </As>
    );
  }
);

Skeleton.displayName = 'Skeleton';
