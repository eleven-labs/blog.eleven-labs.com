import type { NotFoundPageProps } from '@eleven-labs/design-system';

import { useMeta } from 'hoofd';
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
  // The server answers 200 on unknown urls, the page must tell the crawlers not to index it
  useMeta({ name: 'robots', content: 'noindex, follow' });

  if (error) {
    console.error(error);
  }

  return {
    title,
    description: <TransWithHtml i18nKey="pages.not_found.description" />,
  };
};
