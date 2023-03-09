import './Divider.scss';

import { AsProps, Box, ColorSystemProps, MarginSystemProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const dividerSize = ['s', 'm', 'l'] as const;
export type DividerSizeType = (typeof dividerSize)[number];

export type DividerOptions = {
  size?: DividerSizeType;
};
export type DividerProps = AsProps<'hr'> & MarginSystemProps & Pick<ColorSystemProps, 'bg'> & DividerOptions;

export const Divider: React.FC<DividerProps> = ({ size = 's', ...props }) => (
  <Box
    {...props}
    as="hr"
    className={classNames(
      'divider',
      {
        [`divider--${size}`]: size,
      },
      props.className
    )}
  />
);
