import React from 'react';

import { useNotFoundPageContainer } from '@/containers/NotFoundPageContainer/useNotFoundPageContainer';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const NotFoundPageContainer: React.FC = () => {
  const notFoundPageProps = useNotFoundPageContainer();

  return <NotFoundPage {...notFoundPageProps} />;
};
