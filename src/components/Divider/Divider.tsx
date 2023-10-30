import './Divider.scss';

import { Box, polyRef, SpacingSystemProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const dividerSize = ['s', 'm', 'l'] as const;
export type DividerSizeType = (typeof dividerSize)[number];

export interface DividerProps extends SpacingSystemProps {
  size?: DividerSizeType;
  className?: string;
}

export const Divider = polyRef<'hr', DividerProps>(({ as = 'hr', size = 's', className, ...props }) => (
  <Box
    {...props}
    as={as}
    className={classNames(
      'divider',
      {
        [`divider--${size}`]: size,
      },
      className
    )}
  />
));
