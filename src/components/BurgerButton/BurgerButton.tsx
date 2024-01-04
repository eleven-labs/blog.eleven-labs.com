import './BurgerButton.scss';

import { Box, Flex, FlexProps } from '@eleven-labs/design-system';
import React from 'react';

export interface BurgerButtonProps extends FlexProps, React.ComponentPropsWithoutRef<'button'> {}

export const BurgerButton: React.FC<BurgerButtonProps> = (props) => (
  <Flex as="button" flexDirection="column" gap="xxs" className="burger-button" {...props}>
    <Box className="burger-button__line" />
    <Box className="burger-button__line" />
    <Box className="burger-button__line" />
  </Flex>
);
