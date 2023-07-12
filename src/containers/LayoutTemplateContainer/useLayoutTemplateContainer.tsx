import { useHead, useLink, useMeta, useScript } from 'hoofd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { googleSiteVerificationKey, themeColor } from '@/config/website';
import { CookieConsentContainer } from '@/containers/CookieConsentContainer';
import { HeaderContainer } from '@/containers/HeaderContainer';
import { useFooterContainer } from '@/containers/LayoutTemplateContainer/useFooterContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const footer = useFooterContainer();

  useHead({
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
  useMeta({ property: 'og:locale', content: i18n.language });
  useMeta({ property: 'og:site_name', content: 'Blog Eleven Labs' });
  useMeta({ property: 'og:url', content: location.pathname + location.search });
  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Blog Eleven Labs',
      url: 'https://blog.eleven-labs.com/',
    }),
  });

  useLink({ rel: 'apple-touch-icon', sizes: '120x120', href: getPathFile('/imgs/icons/apple-icon-120x120.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '152x152', href: getPathFile('/imgs/icons/apple-icon-152x152.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '180x180', href: getPathFile('/imgs/icons/apple-icon-180x180.png') });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return {
    header: <HeaderContainer />,
    footer,
    cookieConsent: <CookieConsentContainer />,
  };
};
