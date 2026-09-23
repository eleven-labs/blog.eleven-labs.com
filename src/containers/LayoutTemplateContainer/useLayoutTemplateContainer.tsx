import type { LayoutTemplateProps } from '@/templates';
import type { LayoutTemplateData } from '@/types';

import { useHead, useLink, useMeta, useScript } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLoaderData, useLocation } from 'react-router-dom';

import { themeColor } from '@/config/website';
import { GOOGLE_SITE_VERIFICATION, PATHS } from '@/constants';
import { generateUrl } from '@/helpers/assetHelper';
import { getUrl } from '@/helpers/getUrlHelper';
import { getHomePath } from '@/helpers/routerHelper';

import { HeaderContainer } from './HeaderContainer';
import { useFooterContainer } from './useFooterContainer';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const footer = useFooterContainer();
  const layoutTemplateData = useLoaderData() as LayoutTemplateData;
  const isRootPage = Boolean(matchPath(PATHS.ROOT, location.pathname));
  const isHomePage = isRootPage || Boolean(matchPath(PATHS.HOME, location.pathname));
  // The root serves the same page as the home of the default language, only the root should be indexed
  const canonicalUrl = getUrl(isHomePage ? getHomePath(i18n.language) : location.pathname);

  useHead({
    metas: [
      ...(GOOGLE_SITE_VERIFICATION
        ? [
            {
              name: 'google-site-verification',
              content: GOOGLE_SITE_VERIFICATION,
            },
          ]
        : []),
      {
        name: 'apple-mobile-web-app-title',
        content: 'Blog Eleven Labs',
      },
      {
        name: 'theme-color',
        content: themeColor,
      },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    ],
    language: i18n.language,
  });
  useMeta({ property: 'og:locale', content: i18n.language });
  useMeta({ property: 'og:site_name', content: 'Blog Eleven Labs' });
  useMeta({ property: 'og:url', content: canonicalUrl });
  useLink({ rel: 'canonical', href: canonicalUrl });
  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Blog Eleven Labs',
      url: getUrl(getHomePath(i18n.language)),
      inLanguage: i18n.language,
      ...(isRootPage
        ? {
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: generateUrl(`/${i18n.language}/search/?search={search_term_string}`),
              },
              'query-input': 'required name=search_term_string',
            },
          }
        : {}),
    }),
  });

  useLink({ rel: 'apple-touch-icon', sizes: '120x120', href: generateUrl('/imgs/icons/apple-icon-120x120.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '152x152', href: generateUrl('/imgs/icons/apple-icon-152x152.png') });
  useLink({ rel: 'apple-touch-icon', sizes: '180x180', href: generateUrl('/imgs/icons/apple-icon-180x180.png') });

  // Les préconnexions aux domaines de Google Fonts et la feuille de style des deux polices du blog
  // sont posées une fois pour toutes par `HtmlTemplate` : les répéter ici n'ajoutait rien, et la
  // feuille de Work Sans bloquait le rendu pour une police que plus aucune règle n'utilise.
  useLink({ rel: 'alternate', type: 'application/rss+xml', href: generateUrl('/feed.xml') });

  return {
    header: (
      <>
        {/* Sur les petits écrans l'en-tête suit la lecture, voir src/helpers/stickyHeaderHelper.ts */}
        <div
          id="header"
          className="max-md:sticky max-md:top-0 max-md:z-20 max-md:transition-transform max-md:data-hidden:-translate-y-full"
        >
          <HeaderContainer layoutTemplateData={layoutTemplateData} />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.layoutTemplateData = ${JSON.stringify(layoutTemplateData)};`,
          }}
        />
      </>
    ),
    footer,
  };
};
