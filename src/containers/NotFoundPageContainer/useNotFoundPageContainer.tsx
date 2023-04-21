import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { NotFoundPageProps } from '@/pages/NotFoundPage';

export const useNotFoundPageContainer = (): NotFoundPageProps => {
  const { t } = useTranslation();
  const error = useRouteError();

  if (error) {
    console.error(error);
  }

  return {
    backLink: <BackLinkContainer />,
    title: t('pages.not_found.title'),
    description: t('pages.not_found.description'),
  };
};
