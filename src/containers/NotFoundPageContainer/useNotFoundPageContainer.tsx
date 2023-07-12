import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { useTitle } from '@/hooks/useTitle';
import { NotFoundPageProps } from '@/pages/NotFoundPage';

export const useNotFoundPageContainer = (): NotFoundPageProps => {
  const { t } = useTranslation();
  const error = useRouteError();
  const title = t('seo.not_found.title');
  useTitle(title);

  if (error) {
    console.error(error);
  }

  return {
    backLink: <BackLinkContainer />,
    title,
    description: t('pages.not_found.description'),
  };
};
