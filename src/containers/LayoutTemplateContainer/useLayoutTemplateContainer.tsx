import { useHead, useLink, useMeta, useScript } from 'hoofd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';

import { themeColor } from '@/config/website';
import { GOOGLE_SITE_VERIFICATION, ROOT_URL } from '@/constants';
import { PATHS } from '@/constants';
import { HeaderContainer } from '@/containers/HeaderContainer';
import { useFooterContainer } from '@/containers/LayoutTemplateContainer/useFooterContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { getClickEventElements, handleClickEventListener } from '@/helpers/dataLayerHelper';
import { generateUrl } from '@/helpers/routerHelper';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const footer = useFooterContainer();
  const isHomePage = Boolean(matchPath(PATHS.ROOT, location.pathname));

  useHead({
    metas: [
      {
        name: 'google-site-verification',
        content: GOOGLE_SITE_VERIFICATION,
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
      url: ROOT_URL,
      ...(isHomePage
        ? {
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: generateUrl(PATHS.SEARCH, { lang: 'fr', search: '{search_term_string}`' }),
              },
              'query-input': 'required name=search_term_string',
            },
          }
        : {}),
    }),
  });

  useLink({ rel: 'apple-touch-icon', sizes: '120x120', href: getPathFile('/imgs/icons/apple-icon-120x120.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '152x152', href: getPathFile('/imgs/icons/apple-icon-152x152.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '180x180', href: getPathFile('/imgs/icons/apple-icon-180x180.png') });

  useLink({ rel: 'alternate', type: 'application/rss+xml', href: `${ROOT_URL}feed.xml` });

  useEffect(() => {
    window.scrollTo(0, 0);

    const clickEventElements = getClickEventElements();

    clickEventElements.forEach((element) => {
      element.addEventListener('click', handleClickEventListener);
    });

    return () => {
      clickEventElements.forEach((element) => {
        element.removeEventListener('click', handleClickEventListener);
      });
    };
  }, [location]);

  return {
    header: <HeaderContainer />,
    footer,
  };
};
