import { Text } from '@eleven-labs/design-system';
import React from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';

import { contact, socialNetworks, websiteUrl } from '@/config/website';
import { AUTHORIZED_LANGUAGES, PATHS } from '@/constants';
import { LinkContainer } from '@/containers/LinkContainer';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useFooterContainer = (): LayoutTemplateProps['footer'] => {
  const { t, i18n } = useTranslation();

  return {
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
              {address.map((line, index) => (
                <Text key={index}>{line}</Text>
              ))}
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
      as: ReactGA.OutboundLink,
      eventLabel: socialNetwork.iconName,
      iconName: socialNetwork.iconName,
      to: socialNetwork.url,
      'aria-label': socialNetwork.label,
    })),
    languageLinks: AUTHORIZED_LANGUAGES.map((currentLang) => {
      const isActive = currentLang === i18n.language;
      return {
        isActive,
        label: t(`languages.${currentLang}`),
        ...(!isActive
          ? {
              as: LinkContainer,
              to: generatePath(PATHS.HOME, { lang: currentLang }),
              onClick: () => i18n.changeLanguage(currentLang),
            }
          : {}),
      };
    }),
  };
};
