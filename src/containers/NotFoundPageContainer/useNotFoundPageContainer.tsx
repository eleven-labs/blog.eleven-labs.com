import { NotFoundPageProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

import { TransWithHtml } from '@/containers/TransWithHtml';
import { useTitle } from '@/hooks/useTitle';

export const useNotFoundPageContainer = (): NotFoundPageProps => {
  const { t } = useTranslation();
  const error = useRouteError();
  const title = t('pages.not-found.title');
  useTitle(title);

  if (error) {
    console.error(error);
  }

  return {
    title,
    description: <TransWithHtml i18nKey="pages.not_found.description" />,
  };
};
