import './Container.scss';

import { Box, BoxProps, polyRef } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const containerVariant = ['global', 'common', 'content'] as const;
export type ContainerVariantType = (typeof containerVariant)[number];

export interface ContainerProps extends BoxProps {
  variant?: ContainerVariantType;
}

export const Container: React.FC<ContainerProps> = polyRef<'div', ContainerProps>(
  ({ as = 'div', variant = 'common', ...props }, ref) => (
    <Box
      {...props}
      as={as}
      ref={ref}
      className={classNames(
        'container',
        {
          [`container--${variant}`]: variant,
        },
        props.className
      )}
    />
  )
);
