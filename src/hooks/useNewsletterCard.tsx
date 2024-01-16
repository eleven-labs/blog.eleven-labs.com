import { NewsletterCardProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const useNewsletterCard = (): NewsletterCardProps => {
  const { t } = useTranslation();

  return {
    title: t('common.newsletter-card.title'),
    description: t('common.newsletter-card.description'),
    children: <script type="text/javascript" src="//info.eleven-labs.com/form/generate.js?id=10" />,
  };
};
