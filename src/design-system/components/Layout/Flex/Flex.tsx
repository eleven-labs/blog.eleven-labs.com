import type { BoxProps } from '@/design-system';
import type { DisplayType, FlexOrGridSystemProps, FlexSystemProps, TypeWithMediaQueriesType } from '@/design-system/types';

import classNames from 'classnames';
import * as React from 'react';

import { Box } from '@/design-system';
import { flexOrGridSystemProps, flexSystemProps } from '@/design-system/constants';
import { polyRef } from '@/design-system/helpers/polyRef';
import { flexOrGridSystemClassName, flexSystemClassName, omitSystemProps } from '@/design-system/helpers/systemPropsHelper';

export interface FlexProps extends Omit<BoxProps, 'display'>, FlexOrGridSystemProps, FlexSystemProps {
  display?: TypeWithMediaQueriesType<Extract<DisplayType, 'flex' | 'inline-flex'>>;
}

export const Flex = polyRef<'div', FlexProps>(
  ({ as = 'div', display = 'flex', className, children, ...props }, ref) => (
    <Box
      {...omitSystemProps({ props, systemPropNames: Object.keys({ ...flexOrGridSystemProps, ...flexSystemProps }) })}
      ref={ref}
      as={as}
      display={display}
      className={classNames(flexOrGridSystemClassName(props), flexSystemClassName(props), className)}
    >
      {children}
    </Box>
  )
);
