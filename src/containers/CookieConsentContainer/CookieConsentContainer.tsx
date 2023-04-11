import React from 'react';

import { CookieConsent } from '@/components/CookieConsent';
import { useCookieConsentContainer } from '@/containers/CookieConsentContainer/useCookieConsentContainer';

export const CookieConsentContainer: React.FC = () => {
  const cookieConsentProps = useCookieConsentContainer();
  return cookieConsentProps ? <CookieConsent {...cookieConsentProps} /> : null;
};
