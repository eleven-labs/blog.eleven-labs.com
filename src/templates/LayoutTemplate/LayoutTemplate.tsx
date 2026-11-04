import type { FooterProps } from '@/components/footer';

import React from 'react';

import { Footer } from '@/components/footer';

export type LayoutTemplateProps = {
  header: React.ReactNode;
  footer: FooterProps;
  children: React.ReactNode;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, children }) => (
  <div className="flex min-h-screen flex-col">
    {header}
    {children}
    <Footer {...footer} />
  </div>
);
