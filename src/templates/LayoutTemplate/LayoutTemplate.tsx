import { Box, Flex } from '@eleven-labs/design-system';
import React from 'react';

import { CookieConsent, CookieConsentProps } from '@/components/CookieConsent';

import { Footer, FooterProps } from './Footer/Footer';
import { Header, HeaderProps } from './Header/Header';

export type LayoutTemplateProps = {
  header: HeaderProps;
  footer: FooterProps;
  children: React.ReactNode;
  cookieConsent?: CookieConsentProps;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, cookieConsent, children }) => (
  <Flex flexDirection="column" minHeight="screen">
    <Header {...header} />
    <Box as="main" flex="1">
      {children}
    </Box>
    <Footer {...footer} />
    {cookieConsent && <CookieConsent {...cookieConsent} />}
  </Flex>
);
