import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

import { useBackLink } from '@/hooks/useBackLink';
import { NotFoundPageProps } from '@/pages/NotFoundPage';

export const useNotFoundPageContainer = (): NotFoundPageProps => {
  const { t } = useTranslation();
  const error = useRouteError();
  const backLink = useBackLink();

  if (error) {
    console.error(error);
  }

  return {
    backLink,
    title: t('pages.not_found.title'),
    description: t('pages.not_found.description'),
  };
};
