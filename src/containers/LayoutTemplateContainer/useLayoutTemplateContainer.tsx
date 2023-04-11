import { useHead, useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { googleSiteVerificationKey, themeColor } from '@/config/website';
import { HeaderContainer } from '@/containers/HeaderContainer';
import { useFooterContainer } from '@/containers/LayoutTemplateContainer/useFooterContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { t, i18n } = useTranslation();
  const footer = useFooterContainer();
  useHead({
    title: t<string>('meta.title'),
    metas: [
      {
        name: 'google-site-verification',
        content: googleSiteVerificationKey,
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Blog Eleven Labs',
      },
      {
        name: 'theme-color',
        content: themeColor,
      },
    ],
    language: i18n.language,
  });
  useLink({ rel: 'apple-touch-icon', sizes: '120x120', href: getPathFile('/imgs/icons/apple-icon-120x120.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '152x152', href: getPathFile('/imgs/icons/apple-icon-152x152.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '180x180', href: getPathFile('/imgs/icons/apple-icon-180x180.png') });

  return {
    header: <HeaderContainer />,
    footer,
  };
};
