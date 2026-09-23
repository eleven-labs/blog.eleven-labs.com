import type { ComponentPropsWithoutRef } from '@/design-system/types';

import * as React from 'react';

import { Svgs, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const logoName = ['website', 'blog'] as const;
export type LogoNameType = (typeof logoName)[number];

export interface LogoProps extends ComponentPropsWithoutRef<'div'> {
  name: LogoNameType;
  /** Le logo se dimensionne à partir de sa taille de police : tout est exprimé en `em` et `ex`. */
  size?: string | number;
}

export const Logo: React.FC<LogoProps> = ({ name, size, className, ...props }) => (
  <div {...props} className={cn('flex items-center justify-center', className)} style={{ fontSize: size }}>
    <Svgs.Logo height="1em" />
    {name === 'blog' ? (
      <div className="ml-[0.2ex] text-[1ex] leading-none">
        <Text className="font-medium">Eleven Labs</Text>
        <Text className="font-bold">Le blog</Text>
      </div>
    ) : (
      <Text className="ml-[0.2ex] text-[1.5ex] leading-none font-medium">Eleven Labs</Text>
    )}
  </div>
);
