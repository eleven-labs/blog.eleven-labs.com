import { Button, Text } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { contact, socialNetworks, websiteUrl } from '@/config/website';
import { LanguageEnum, PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
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
      'data-website-link': true,
    } as LayoutTemplateProps['footer']['elevenLabsSiteLink'],
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
          description: (
            <Button as="a" href={contact.formLink} target="_blank" data-contact-link>
              {t('footer.contact.form_title')}
            </Button>
          ),
        },
      ],
    },
    socialLinks: socialNetworks.map((socialNetwork) => ({
      as: 'a',
      iconName: socialNetwork.iconName,
      href: socialNetwork.url,
      target: '_blank',
      'aria-label': socialNetwork.label,
    })),
    languageLinks: Object.values(LanguageEnum).map((currentLang) => {
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
