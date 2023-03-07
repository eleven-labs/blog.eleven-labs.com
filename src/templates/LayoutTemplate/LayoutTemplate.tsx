import { Box, Flex } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CookieConsent, CookieConsentProps } from '@/components/CookieConsent';
import { useSeo } from '@/hooks/useSeo';

import { Footer, FooterProps } from './Footer/Footer';
import { Header, HeaderProps } from './Header/Header';

export type LayoutTemplateProps = {
  header: HeaderProps;
  footer: FooterProps;
  children: React.ReactNode;
  cookieConsent?: CookieConsentProps;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, cookieConsent, children }) => {
  const { t } = useTranslation();
  useSeo({
    title: t<string>('meta.title'),
  });

  return (
    <Flex flexDirection="column" minHeight="screen">
      <Header {...header} />
      <Box as="main" flex="1">
        {children}
      </Box>
      <Footer {...footer} />
      {cookieConsent && <CookieConsent {...cookieConsent} />}
    </Flex>
  );
};
