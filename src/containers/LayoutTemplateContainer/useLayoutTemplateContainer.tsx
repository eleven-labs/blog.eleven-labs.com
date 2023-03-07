import { useLocation } from 'react-router-dom';

import { useCookieConsentContainer } from '@/containers/LayoutTemplateContainer/useCookieConsentContainer';
import { useFooterContainer } from '@/containers/LayoutTemplateContainer/useFooterContainer';
import { useHeaderContainer } from '@/containers/LayoutTemplateContainer/useHeaderContainer';
import { useLayoutEffect } from '@/hooks/useLayoutEffect';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const location = useLocation();
  const header = useHeaderContainer();
  const footer = useFooterContainer();
  const cookieConsent = useCookieConsentContainer();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return {
    header,
    footer,
    cookieConsent,
  };
};
