import React from 'react';
import { useCookies } from 'react-cookie';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { googleAnalytics } from '@/config/website';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useCookieConsentContainer = (): LayoutTemplateProps['cookieConsent'] => {
  const { t } = useTranslation();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [cookieConsent, setCookieConsent] = React.useState<LayoutTemplateProps['cookieConsent']>();

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

  React.useEffect((): void => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  React.useEffect((): void => {
    if (cookies.hasConsent === undefined) {
      setCookieConsent({
        title: t<string>('cookie_consent.title'),
        description: t<string>('cookie_consent.description'),
        declineButton: {
          label: t<string>('cookie_consent.button_decline_label'),
          onClick: declineCookieConsent,
        },
        acceptButton: {
          label: t<string>('cookie_consent.button_accept_label'),
          onClick: acceptCookieConsent,
        },
      });
      return;
    }
    setCookieConsent(undefined);
    /*startGoogleAnalytics({ isAnonymous: !cookies.hasConsent });*/
  }, [cookies.hasConsent, startGoogleAnalytics]);

  const declineCookieConsent = (): void => {
    setCookie(`ga-disable-${googleAnalytics.trackingCode}`, true, { maxAge: googleAnalytics.cookieExpires });
    setCookie('hasConsent', false, { maxAge: googleAnalytics.cookieExpires });
    (window as any)[`ga-disable-${googleAnalytics.trackingCode}`] = true; //eslint-disable-line @typescript-eslint/no-explicit-any
    googleAnalytics.cookieNames.forEach((cookieName) => removeCookie(cookieName));
    startGoogleAnalytics({ isAnonymous: true });
  };

  const acceptCookieConsent = (): void => {
    setCookie('hasConsent', true, { maxAge: googleAnalytics.cookieExpires });
    startGoogleAnalytics({ isAnonymous: false });
  };

  return cookieConsent;
};
