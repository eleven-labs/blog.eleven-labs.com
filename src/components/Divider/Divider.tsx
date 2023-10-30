import './Divider.scss';

import { Box, ColorSystemProps, polyRef, SpacingSystemProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const dividerSize = ['s', 'm', 'l'] as const;
export type DividerSizeType = (typeof dividerSize)[number];

export interface DividerProps extends Pick<ColorSystemProps, 'bg'>, SpacingSystemProps {
  size?: DividerSizeType;
  className?: string;
}

export const Divider = polyRef<'hr', DividerProps>(({ as = 'hr', size = 's', className, ...props }, ref) => (
  <Box
    {...props}
    as={as}
    ref={ref}
    className={classNames(
      'divider',
      {
        [`divider--${size}`]: size,
      },
      className
    )}
  />
));
