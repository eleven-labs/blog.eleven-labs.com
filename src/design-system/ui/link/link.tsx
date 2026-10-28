import type { IconNameType } from '@/design-system/types';

import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';
import { Text } from '@/design-system/ui/text';

export interface LinkProps extends useRender.ComponentProps<'a'> {
  /** Affiche une icône devant le libellé, le lien passant alors en `inline-flex`. */
  icon?: IconNameType;
}

/** Lien de texte : `render` remplace la balise `<a>` (lien du routeur, par exemple). */
export const Link: React.FC<LinkProps> = ({ render, icon, className, children, ...props }) =>
  useRender({
    defaultTagName: 'a',
    render,
    props: {
      ...props,
      className: cn('link', icon && 'link-icon', className),
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
