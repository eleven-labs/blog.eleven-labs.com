import { ContactCardProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { contactUrl } from '@/config/website';
import { TransWithHtml } from '@/containers/TransWithHtml';

export const useContactCard = (): ContactCardProps => {
  const { t } = useTranslation();

  return {
    title: <TransWithHtml i18nKey="common.contact_card.title" onlyLineBreak />,
    subtitle: <TransWithHtml i18nKey="common.contact_card.subtitle" onlyLineBreak />,
    description: <TransWithHtml i18nKey="common.contact_card.description" />,
    link: {
      label: t('common.contact_card.link_label'),
      href: contactUrl,
    },
  };
};
