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
    {header}
    <Box as="main" flex="1">
      {children}
    </Box>
    <Footer {...footer} />
  </Flex>
);
