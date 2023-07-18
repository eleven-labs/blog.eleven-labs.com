import React from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { CookieConsentProps } from '@/components/CookieConsent';
import { cookieConsentConfig } from '@/config/website';

export const useCookieConsentContainer = (): CookieConsentProps | undefined => {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies([cookieConsentConfig.name]);
  const cookieConsent = cookies[cookieConsentConfig.name];
  const [cookieConsentProps, setCookieConsentProps] = React.useState<CookieConsentProps>();

  const declineCookieConsent = React.useCallback((): void => {
    setCookie(cookieConsentConfig.name, '{ad_storage:false,analytics_storage:false}', {
      maxAge: cookieConsentConfig.cookieExpires,
      path: '/',
    });
  }, [setCookie]);

  const acceptCookieConsent = React.useCallback((): void => {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
    setCookie(cookieConsentConfig.name, '{ad_storage:true,analytics_storage:true}', {
      maxAge: cookieConsentConfig.cookieExpires,
      path: '/',
    });
  }, [setCookie]);

  React.useEffect((): void => {
    if (cookieConsent === undefined) {
      setCookieConsentProps({
        title: t('cookie_consent.title'),
        description: t('cookie_consent.description'),
        declineButton: {
          label: t('cookie_consent.button_decline_label'),
          onClick: declineCookieConsent,
        },
        acceptButton: {
          label: t('cookie_consent.button_accept_label'),
          onClick: acceptCookieConsent,
        },
      });
      return;
    }
    setCookieConsentProps(undefined);
  }, [acceptCookieConsent, cookieConsent, declineCookieConsent, t]);

  return cookieConsentProps;
};
