import React from 'react';
import { useCookies } from 'react-cookie';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { CookieConsentProps } from '@/components/CookieConsent';
import { googleAnalytics } from '@/config/website';

export const useCookieConsentContainer = (): CookieConsentProps | undefined => {
  const { t } = useTranslation();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [cookieConsent, setCookieConsent] = React.useState<CookieConsentProps>();

  const startGoogleAnalytics = React.useCallback(
    (options: { isAnonymous: boolean }): void => {
      if (options.isAnonymous) {
        ReactGA.initialize(googleAnalytics.trackingCodeAnonymized, {
          gaOptions: {
            storage: 'none',
          },
        });
        ReactGA.ga('set', 'anonymizeIp', true);
      } else {
        ReactGA.initialize(googleAnalytics.trackingCode);
      }
      ReactGA.pageview(location.pathname + location.search);
    },
    [location.pathname, location.search]
  );

  const declineCookieConsent = React.useCallback((): void => {
    setCookie(`ga-disable-${googleAnalytics.trackingCode}`, true, { maxAge: googleAnalytics.cookieExpires });
    setCookie('hasConsent', false, { maxAge: googleAnalytics.cookieExpires });
    (window as any)[`ga-disable-${googleAnalytics.trackingCode}`] = true; //eslint-disable-line @typescript-eslint/no-explicit-any
    googleAnalytics.cookieNames.forEach((cookieName) => removeCookie(cookieName));
    startGoogleAnalytics({ isAnonymous: true });
  }, [removeCookie, setCookie, startGoogleAnalytics]);

  const acceptCookieConsent = React.useCallback((): void => {
    setCookie('hasConsent', true, { maxAge: googleAnalytics.cookieExpires });
    startGoogleAnalytics({ isAnonymous: false });
  }, [setCookie, startGoogleAnalytics]);

  React.useEffect((): void => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  React.useEffect((): void => {
    if (cookies.hasConsent === undefined) {
      setCookieConsent({
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
    setCookieConsent(undefined);
    startGoogleAnalytics({ isAnonymous: !cookies.hasConsent });
  }, [acceptCookieConsent, cookies.hasConsent, declineCookieConsent, startGoogleAnalytics, t]);

  return cookieConsent;
};
