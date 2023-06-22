import './Container.scss';

import { As, AsProps, Box, BoxProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const containerVariant = ['global', 'common', 'content'] as const;
export type ContainerVariantType = (typeof containerVariant)[number];

export type ContainerOptions = {
  variant?: ContainerVariantType;
};

export type ContainerProps<T extends As = 'div'> = AsProps<T> & BoxProps & ContainerOptions;

export const Container: React.FC<ContainerProps> = ({ variant = 'common', ...props }) => (
  <Box
    {...props}
    className={classNames(
      'container',
      {
        [`container--${variant}`]: variant,
      },
      props.className
    )}
  />
);
