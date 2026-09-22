import type { BoxProps } from '@/design-system';
import type { IconNameType } from '@/design-system/types';

import classNames from 'classnames';
import * as React from 'react';

import { Box, Flex, Icon, Text } from '@/design-system';
import { polyRef } from '@/design-system/helpers/polyRef';

import './Link.scss';

export interface LinkProps extends BoxProps {
  className?: string;
  icon?: IconNameType;
  children?: React.ReactNode;
}

export const Link = polyRef<'a', LinkProps>(({ as = 'a', icon, className, children, ...props }, ref) =>
  icon ? (
    <Flex
      {...props}
      ref={ref}
      as={as}
      display="inline-flex"
      alignItems="center"
      color="info"
      className={classNames('link', className)}
    >
      {icon && <Icon name={icon} />}
      <Text as="span">{children}</Text>
    </Flex>
  ) : (
    <Box {...props} ref={ref} as={as} color="info" className={classNames('link', className)}>
      {children}
    </Box>
  )
);

Link.displayName = 'Link';
