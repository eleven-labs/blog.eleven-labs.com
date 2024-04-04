import { NewsletterCardProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TransWithHtml } from '@/containers/TransWithHtml';

export const useNewsletterCard = (): NewsletterCardProps => {
  const { i18n } = useTranslation();
  return {
    title: <TransWithHtml i18nKey="common.newsletter-card.title" onlyLineBreak />,
    description: <TransWithHtml i18nKey="common.newsletter-card.description" />,
    children: (
      <script
        type="text/javascript"
        src={`//info.eleven-labs.com/form/generate.js?id=${i18n.language === 'en' ? 16 : 10}`}
      />
    ),
  };
};
