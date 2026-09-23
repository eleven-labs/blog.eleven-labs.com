import type { BoxProps } from '@/design-system';
import type { HeadingSizeType } from '@/design-system/types';

import classNames from 'classnames';
import * as React from 'react';

import { Box } from '@/design-system';
import { polyRef } from '@/design-system/helpers/polyRef';

export interface HeadingProps extends Omit<BoxProps, 'textSize'> {
  size?: HeadingSizeType;
}

export const Heading = polyRef<'p', HeadingProps>(({ as = 'p', size, children, className, ...props }, ref) => (
  <Box {...props} as={as} ref={ref} className={classNames({ [`heading-${size}`]: Boolean(size) }, className)}>
    {children}
  </Box>
));

Heading.displayName = 'Heading';
