import { useTranslation } from 'react-i18next';

import { ContactBlockProps } from '@/components';
import { contactUrl } from '@/config/website';

export const useContactBlock = (): ContactBlockProps => {
  const { t } = useTranslation();

  return {
    title: t('contact_block.title'),
    subtitle: t('contact_block.subtitle'),
    description: t('contact_block.description'),
    link: {
      label: t('contact_block.link_label'),
      href: contactUrl,
    },
  };
};
