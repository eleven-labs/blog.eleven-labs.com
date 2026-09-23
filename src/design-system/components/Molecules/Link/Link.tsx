import type { IconNameType } from '@/design-system/types';

import * as React from 'react';

import { Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';
import { polyRef } from '@/design-system/helpers/polyRef';

export interface LinkProps {
  className?: string;
  icon?: IconNameType;
  children?: React.ReactNode;
}

const linkClassName = 'font-semibold text-info underline hover:no-underline';

export const Link = polyRef<'a', LinkProps>(({ as: As = 'a', icon, className, children, ...props }, ref) =>
  icon ? (
    <As {...props} ref={ref} className={cn(linkClassName, 'inline-flex items-center', className)}>
      <Icon name={icon} />
      <Text as="span">{children}</Text>
    </As>
  ) : (
    <As {...props} ref={ref} className={cn(linkClassName, className)}>
      {children}
    </As>
  )
);

Link.displayName = 'Link';
