import { ContactCardProps } from '@eleven-labs/design-system';
import { useTranslation } from 'react-i18next';

import { contactUrl } from '@/config/website';

export const useContactCard = (): ContactCardProps => {
  const { t } = useTranslation();

  return {
    title: t('contact_card.title'),
    subtitle: t('contact_card.subtitle'),
    description: t('contact_card.description'),
    link: {
      label: t('contact_card.link_label'),
      href: contactUrl,
    },
  };
};
