import * as React from 'react';

import { Svgs, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';
import { polyRef } from '@/design-system/helpers/polyRef';

export const logoName = ['website', 'blog'] as const;
export type LogoNameType = (typeof logoName)[number];

export interface LogoProps {
  name: LogoNameType;
  /** Le logo se dimensionne à partir de sa taille de police : tout est exprimé en `em` et `ex`. */
  size?: string | number;
  className?: string;
}

export const Logo = polyRef<'div', LogoProps>(({ as: As = 'div', name, size, className, ...props }, ref) => (
  <As {...props} ref={ref} className={cn('flex items-center justify-center', className)} style={{ fontSize: size }}>
    <Svgs.Logo height="1em" />
    {name === 'blog' ? (
      <div className="ml-[0.2ex] text-[1ex] leading-none">
        <Text className="font-medium">Eleven Labs</Text>
        <Text className="font-bold">Le blog</Text>
      </div>
    ) : (
      <Text className="ml-[0.2ex] text-[1.5ex] leading-none font-medium">Eleven Labs</Text>
    )}
  </As>
));

Logo.displayName = 'Logo';
