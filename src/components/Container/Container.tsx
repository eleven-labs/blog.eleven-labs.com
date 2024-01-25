import './Container.scss';

import { Box, BoxProps, polyRef } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const containerVariant = ['global', 'common', 'content'] as const;
export type ContainerVariantType = (typeof containerVariant)[number];

export type ContainerOptions = {
  variant?: ContainerVariantType;
};

export type ContainerProps = BoxProps & ContainerOptions;

export const Container = polyRef<'div', ContainerProps>(({ variant = 'common', ...props }, ref) => (
  <Box
    {...props}
    ref={ref}
    className={classNames(
      'container',
      {
        [`container--${variant}`]: variant,
      },
      props.className
    )}
  />
));
