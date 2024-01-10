import { LayoutTemplateProps, Text } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { contact, socialNetworks, websiteUrl } from '@/config/website';
import { LANGUAGES_AVAILABLE_WITH_DT, PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';

export const useFooterContainer = (): LayoutTemplateProps['footer'] => {
  const { t, i18n } = useTranslation();

  return {
    introBlock: {
      title: t('footer.intro_block.title'),
      description: t('footer.intro_block.description'),
    },
    elevenLabsSiteLink: {
      target: '_blank',
      href: websiteUrl,
      'data-website-link': true,
    } as LayoutTemplateProps['footer']['elevenLabsSiteLink'],
    contactLink: {
      label: t('footer.contact_label_link'),
      href: contact.formLink,
    },
    addressList: contact.addressList.map(({ name, address }) => ({
      title: name,
      description: (
        <>
          {address.map((line, index) => (
            <Text key={index}>{line}</Text>
          ))}
        </>
      ),
    })),
    socialLinks: socialNetworks.map((socialNetwork) => ({
      as: 'a',
      iconName: socialNetwork.iconName,
      href: socialNetwork.url,
      target: '_blank',
      'aria-label': socialNetwork.label,
    })),
    languageLinks: LANGUAGES_AVAILABLE_WITH_DT.map((currentLang) => {
      const isActive = currentLang === i18n.language;
      return {
        isActive,
        label: t(`languages.${currentLang}`),
        ...(!isActive
          ? {
              href: generatePath(PATHS.HOME, { lang: currentLang }),
              onClick: () => i18n.changeLanguage(currentLang),
            }
          : {}),
      };
    }),
  };
};
