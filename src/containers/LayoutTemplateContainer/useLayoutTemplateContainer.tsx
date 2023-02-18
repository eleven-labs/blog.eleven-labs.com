import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLocation } from 'react-router-dom';

import { contact, socialNetworks, websiteUrl } from '@/config/website';
import { AUTHORIZED_LANGUAGES, PATHS } from '@/constants';
import { useLayoutEffect } from '@/hooks/useLayoutEffect';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return {
    header: {
      homeLink: {
        as: Link,
        to: generatePath(PATHS.HOME, { lang: i18n.language }),
      } as LayoutTemplateProps['header']['homeLink'],
    },
    footer: {
      introBlock: {
        title: t('footer.intro_block.title'),
        description: t('footer.intro_block.description'),
      },
      elevenLabsSiteLink: {
        as: 'a',
        label: t('footer.link_to_eleven_labs_site'),
        target: '_blank',
        href: websiteUrl,
      },
      contact: {
        title: t('footer.contact.title'),
        list: [
          ...contact.addressList.map(({ name, address }) => ({
            title: name,
            description: (
              <>
                {address.streetLine}
                <br />
                {address.zipCode} {address.city.toLocaleUpperCase()}
              </>
            ),
          })),
          {
            title: contact.email,
            description: contact.phoneNumber,
          },
        ],
      },
      socialLinks: socialNetworks.map((socialNetwork) => ({
        iconName: socialNetwork.iconName,
        href: socialNetwork.url,
      })),
      languageLinks: AUTHORIZED_LANGUAGES.map((currentLang) => {
        const isActive = currentLang === i18n.language;
        const languageLinkProps = {
          to: generatePath(PATHS.HOME, { lang: currentLang }),
          onClick: () => i18n.changeLanguage(currentLang),
        };
        return {
          as: Link,
          isActive,
          label: t(`languages.${currentLang}`),
          ...(!isActive ? languageLinkProps : {}),
        };
      }),
    },
  };
};
