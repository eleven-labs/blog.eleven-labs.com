import { Box, Flex } from '@eleven-labs/design-system';
import React from 'react';

import { Footer, FooterProps } from '@/templates';

export type LayoutTemplateProps = {
  header: React.ReactNode;
  footer: FooterProps;
  children: React.ReactNode;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, children }) => (
  <Flex flexDirection="column" minHeight="screen">
    <Box partial-hydrate="header-container">{header}</Box>
    <Box as="main" flex="1">
      {children}
    </Box>
    <Footer {...footer} />
    <Box partial-hydrate="cookie-consent-container"></Box>
  </Flex>
);
