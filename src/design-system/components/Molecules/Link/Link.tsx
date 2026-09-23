import type { IconNameType } from '@/design-system/types';

import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface LinkProps extends useRender.ComponentProps<'a'> {
  /** Affiche une icône devant le libellé, le lien passant alors en `inline-flex`. */
  icon?: IconNameType;
}

const linkClassName = 'font-semibold text-info underline hover:no-underline';

export const Link: React.FC<LinkProps> = ({ render, icon, className, children, ...props }) =>
  useRender({
    defaultTagName: 'a',
    render,
    props: {
      ...props,
      className: cn(linkClassName, icon && 'inline-flex items-center', className),
      children: icon ? (
        <>
          <Icon name={icon} />
          <Text render={<span />}>{children}</Text>
        </>
      ) : (
        children
      ),
    },
  });
