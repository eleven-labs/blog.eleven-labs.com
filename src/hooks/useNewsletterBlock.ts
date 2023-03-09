import { useTranslation } from 'react-i18next';

import { NewsletterBlockProps } from '@/components';
import { newsletterFormUrl } from '@/config/website';

export const useNewsletterBlock = (): NewsletterBlockProps => {
  const { t } = useTranslation();

  return {
    title: t('newsletter.title'),
    description: t('newsletter.description'),
    subscribeButton: {
      as: 'a',
      label: t('newsletter.button_label'),
      target: '_blank',
      href: newsletterFormUrl,
    },
  };
};
