import type { FlexProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Box, Flex } from '@/design-system';

import './BurgerButton.scss';

export interface BurgerButtonProps extends FlexProps, ComponentPropsWithoutRef<'button'> {}

export const BurgerButton: React.FC<BurgerButtonProps> = (props) => (
  <Flex as="button" flexDirection="column" gap="xxs" className="burger-button" {...props}>
    <Box className="burger-button__line" />
    <Box className="burger-button__line" />
    <Box className="burger-button__line" />
  </Flex>
);
