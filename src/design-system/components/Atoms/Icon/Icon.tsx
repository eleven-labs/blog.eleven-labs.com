import type { IconNameType } from '@/design-system/types';

import * as React from 'react';

import { Svgs } from '@/design-system/components/Atoms';
import { cn } from '@/design-system/helpers/cn';
import { pascalCase } from '@/design-system/helpers/stringHelper';

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'name' | 'color'> & {
  name: IconNameType;
  /** Raccourci pour dimensionner l'icône, qui se mesure en `em`. */
  size?: string | number;
};

export const Icon: React.FC<IconProps> = ({ name, size, width, height, className, style, ...svgProps }) => {
  const Svg = (Svgs as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[pascalCase(name)];

  return (
    <Svg
      {...svgProps}
      className={cn(className)}
      height={height ?? '1em'}
      width={width ?? '1em'}
      style={{ fontSize: size, ...style }}
    />
  );
};
