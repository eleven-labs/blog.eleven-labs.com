import { useTitle } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useCookieConsentContainer } from '@/containers/LayoutTemplateContainer/useCookieConsentContainer';
import { useFooterContainer } from '@/containers/LayoutTemplateContainer/useFooterContainer';
import { useHeaderContainer } from '@/containers/LayoutTemplateContainer/useHeaderContainer';
import { useLayoutEffect } from '@/hooks/useLayoutEffect';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { t } = useTranslation();
  const location = useLocation();
  const header = useHeaderContainer();
  const footer = useFooterContainer();
  const cookieConsent = useCookieConsentContainer();
  useTitle(t<string>('meta.title'));

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return {
    header,
    footer,
    cookieConsent,
  };
};
