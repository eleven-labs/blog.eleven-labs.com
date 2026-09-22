import type { ColorSystemProps, IconNameType, MarginSystemProps } from '@/design-system/types';

import classNames from 'classnames';
import * as React from 'react';

import { Svgs } from '@/design-system';
import { marginSystemProps } from '@/design-system/constants';
import { pascalCase } from '@/design-system/helpers/stringHelper';
import { colorSystemClassName, omitSystemProps, spacingSystemClassName } from '@/design-system/helpers/systemPropsHelper';

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'name' | 'color'> &
  MarginSystemProps &
  Pick<ColorSystemProps, 'color'> & {
    name: IconNameType;
    size?: string | number;
    width?: string | number;
    height?: string | number;
  };

export const Icon: React.FC<IconProps> = ({ name, size, width, height, ...svgProps }) => {
  const Svg = (Svgs as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[pascalCase(name)];
  return (
    <Svg
      {...omitSystemProps({ props: svgProps, systemPropNames: [...Object.keys(marginSystemProps), 'color'] })}
      className={classNames(
        'icon',
        spacingSystemClassName(svgProps),
        colorSystemClassName(svgProps),
        svgProps?.className
      )}
      height={height ?? '1em'}
      width={width ?? '1em'}
      style={{ fontSize: size, ...svgProps.style }}
    />
  );
};
