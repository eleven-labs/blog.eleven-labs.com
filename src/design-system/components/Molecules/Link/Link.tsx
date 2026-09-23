import type { ElementTagName, IconNameType, PolymorphicProps } from '@/design-system/types';

import * as React from 'react';

import { Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface LinkOwnProps {
  className?: string;
  /** Affiche une icône devant le libellé, le lien passant alors en `inline-flex`. */
  icon?: IconNameType;
  children?: React.ReactNode;
}

export type LinkProps<TTagName extends ElementTagName = 'a'> = PolymorphicProps<TTagName, LinkOwnProps>;

const linkClassName = 'font-semibold text-info underline hover:no-underline';

export const Link = <TTagName extends ElementTagName = 'a'>({
  as,
  icon,
  className,
  children,
  ...props
}: LinkProps<TTagName>): React.JSX.Element => {
  const Tag = (as ?? 'a') as React.ElementType;

  if (!icon) {
    return (
      <Tag {...props} className={cn(linkClassName, className)}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag {...props} className={cn(linkClassName, 'inline-flex items-center', className)}>
      <Icon name={icon} />
      <Text as="span">{children}</Text>
    </Tag>
  );
};
