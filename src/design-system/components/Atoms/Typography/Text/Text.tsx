import type { BoxProps } from '@/design-system';
import type { TextSizeType } from '@/design-system/types';

import classNames from 'classnames';
import * as React from 'react';

import { Box } from '@/design-system';
import { polyRef } from '@/design-system/helpers/polyRef';

export interface TextProps extends Omit<BoxProps, 'textSize'> {
  size?: TextSizeType;
}

export const Text = polyRef<'p', TextProps>(({ as = 'p', size, className, children, ...props }, ref) => (
  <Box {...props} as={as} ref={ref} className={classNames({ [`text-${size}`]: Boolean(size) }, className)}>
    {children}
  </Box>
));

Text.displayName = 'Text';
