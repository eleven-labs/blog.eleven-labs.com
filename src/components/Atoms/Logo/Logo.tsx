import type { FlexProps } from '@/design-system';

import classNames from 'classnames';
import * as React from 'react';

import { Box, Flex, Svgs, Text } from '@/design-system';
import { polyRef } from '@/design-system/helpers/polyRef';

import './Logo.scss';

export const logoName = ['website', 'blog'] as const;
export type LogoNameType = (typeof logoName)[number];

export interface LogoProps extends FlexProps {
  name: LogoNameType;
  size?: string | number;
}

export const Logo = polyRef<'div', LogoProps>(({ name, size, ...props }, ref) => (
  <Flex
    {...props}
    ref={ref}
    justifyContent="center"
    alignItems="center"
    className={classNames('logo', props.className)}
    style={{ fontSize: size }}
  >
    <Svgs.Logo height="1em" />
    {name === 'blog' ? (
      <Box className="logo__blog">
        <Text fontWeight="medium">Eleven Labs</Text>
        <Text fontWeight="bold">Le blog</Text>
      </Box>
    ) : (
      <Text fontWeight="medium" className="logo__website">
        Eleven Labs
      </Text>
    )}
  </Flex>
));
