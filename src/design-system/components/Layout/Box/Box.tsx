import type { SystemProps } from '@/design-system/types';

import classNames from 'classnames';
import * as React from 'react';

import { systemProps } from '@/design-system/constants';
import { polyRef } from '@/design-system/helpers/polyRef';
import { omitSystemProps, systemClassName } from '@/design-system/helpers/systemPropsHelper';

export interface BoxProps extends SystemProps {
  className?: string;
  children?: React.ReactNode;
}

export const Box = polyRef<'div', BoxProps>(({ as: As = 'div', className, children, ...props }, ref) => (
  <As
    {...omitSystemProps({ props, systemPropNames: Object.keys(systemProps) })}
    ref={ref}
    className={classNames(systemClassName(props), className)}
  >
    {children}
  </As>
));

Box.displayName = 'Box';
