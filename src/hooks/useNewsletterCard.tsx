import { NewsletterCardProps } from '@eleven-labs/design-system';
import React from 'react';

import { TransWithHtml } from '@/containers/TransWithHtml';

export const useNewsletterCard = (): NewsletterCardProps => ({
  title: <TransWithHtml i18nKey="common.newsletter-card.title" onlyLineBreak />,
  description: <TransWithHtml i18nKey="common.newsletter-card.description" />,
  children: <script type="text/javascript" src="//info.eleven-labs.com/form/generate.js?id=10" />,
});
