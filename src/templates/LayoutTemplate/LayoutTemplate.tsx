import type { FooterProps } from '@/components';

import React from 'react';

import { Footer } from '@/components';
import { Flex } from '@/design-system';

import './LayoutTemplate.scss';

export type LayoutTemplateProps = {
  header: React.ReactNode;
  footer: FooterProps;
  children: React.ReactNode;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, children }) => (
  <Flex flexDirection="column" className="layout-template">
    {header}
    {children}
    <Footer {...footer} />
  </Flex>
);
