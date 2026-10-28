import type { ComponentPropsWithoutRef } from '@/design-system/types';

import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Svgs } from '@/design-system/ui/icon';
import { Text } from '@/design-system/ui/text';

export const logoName = ['website', 'blog'] as const;
export type LogoNameType = (typeof logoName)[number];

export interface LogoProps extends ComponentPropsWithoutRef<'div'> {
  name: LogoNameType;
  /** Le logo se dimensionne à partir de sa taille de police : tout est exprimé en `em` et `ex`. */
  size?: string | number;
}

/** Logo Eleven Labs : le pictogramme suivi du nom, en version « site » ou « blog ». */
export const Logo: React.FC<LogoProps> = ({ name, size, className, ...props }) => (
  <div {...props} className={cn('logo', className)} style={{ fontSize: size }}>
    <Svgs.Logo height="1em" aria-hidden="true" />
    {name === 'blog' ? (
      <div className="logo-name-blog">
        <Text className="font-medium">Eleven Labs</Text>
        <Text className="font-bold">Le blog</Text>
      </div>
    ) : (
      <Text className="logo-name">Eleven Labs</Text>
    )}
  </div>
);
