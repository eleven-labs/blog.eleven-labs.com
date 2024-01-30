import { NotFoundPage } from '@eleven-labs/design-system';
import React from 'react';

import { useNotFoundPageContainer } from '@/containers/NotFoundPageContainer/useNotFoundPageContainer';

export const NotFoundPageContainer: React.FC = () => {
  const notFoundPageProps = useNotFoundPageContainer();

  return <NotFoundPage {...notFoundPageProps} />;
};
