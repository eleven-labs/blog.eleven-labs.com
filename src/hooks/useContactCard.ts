import { ContactCardProps } from '@eleven-labs/design-system';
import { useTranslation } from 'react-i18next';

import { contactUrl } from '@/config/website';

export const useContactCard = (): ContactCardProps => {
  const { t } = useTranslation();

  return {
    title: t('common.contact_card.title'),
    subtitle: t('common.contact_card.subtitle'),
    description: t('common.contact_card.description'),
    link: {
      label: t('common.contact_card.link_label'),
      href: contactUrl,
    },
  };
};
