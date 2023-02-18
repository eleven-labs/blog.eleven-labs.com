import { Box, Flex } from '@eleven-labs/design-system';
import React from 'react';

import { Footer, FooterProps } from './Footer/Footer';
import { Header, HeaderProps } from './Header';

export type LayoutTemplateProps = {
  header: HeaderProps;
  footer: FooterProps;
  children: React.ReactNode;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, children }) => (
  <Flex flexDirection="column" minHeight="screen">
    <Header {...header} />
    <Box as="main" flex="1">
      {children}
    </Box>
    <Footer {...footer} />
  </Flex>
);
