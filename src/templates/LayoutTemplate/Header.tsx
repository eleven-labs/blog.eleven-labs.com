import { AsProps, Box, Flex, Logo } from '@eleven-labs/design-system';
import React from 'react';

export interface HeaderProps {
  homeLink: AsProps<'a'>;
}

export const Header: React.FC<HeaderProps> = ({ homeLink }) => (
  <Box as="header" bg="azure">
    <Flex justifyContent="between" alignItems="center" py="s" px={{ xs: 'm', md: 'l' }}>
      <Box {...(homeLink as typeof Box)} color="white">
        <Logo name="blog" size="2.75rem" />
      </Box>
    </Flex>
  </Box>
);
