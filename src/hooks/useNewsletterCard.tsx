import { NewsletterCardProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const useNewsletterCard = (): NewsletterCardProps => {
  const { t } = useTranslation();

  return {
    title: t('newsletter.title'),
    description: t('newsletter.description'),
    children: (
      <iframe src="//info.eleven-labs.com/form/10" width="300" height="300">
        <p>Your browser does not support iframes.</p>
      </iframe>
    ),
  };
};
