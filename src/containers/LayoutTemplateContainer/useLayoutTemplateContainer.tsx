import { useHead, useLink } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { googleSiteVerificationKey, themeColor } from '@/config/website';
import { useCookieConsentContainer } from '@/containers/LayoutTemplateContainer/useCookieConsentContainer';
import { useFooterContainer } from '@/containers/LayoutTemplateContainer/useFooterContainer';
import { useHeaderContainer } from '@/containers/LayoutTemplateContainer/useHeaderContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { useLayoutEffect } from '@/hooks/useLayoutEffect';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const header = useHeaderContainer();
  const footer = useFooterContainer();
  const cookieConsent = useCookieConsentContainer();

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

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return {
    header,
    footer,
    cookieConsent,
  };
};
