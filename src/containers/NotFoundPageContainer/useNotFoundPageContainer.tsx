import { NotFoundPageProps } from '@eleven-labs/design-system';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

import { useTitle } from '@/hooks/useTitle';

export const useNotFoundPageContainer = (): NotFoundPageProps => {
  const { t } = useTranslation();
  const error = useRouteError();
  const title = t('seo.not_found.title');
  useTitle(title);

  if (error) {
    console.error(error);
  }

  return {
    title,
    description: t('pages.not_found.description'),
  };
};
