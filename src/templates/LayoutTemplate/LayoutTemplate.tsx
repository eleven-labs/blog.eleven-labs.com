import { Box, Flex } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSeo } from '@/hooks/useSeo';

import { Footer, FooterProps } from './Footer/Footer';
import { Header, HeaderProps } from './Header/Header';

export type LayoutTemplateProps = {
  header: HeaderProps;
  footer: FooterProps;
  children: React.ReactNode;
};

export const LayoutTemplate: React.FC<LayoutTemplateProps> = ({ header, footer, children }) => {
  const { t } = useTranslation();
  useSeo({
    title: t('meta.title') as string,
  });

  return (
    <Flex flexDirection="column" minHeight="screen">
      <Header {...header} />
      <Box as="main" flex="1">
        {children}
      </Box>
      <Footer {...footer} />
    </Flex>
  );
};
