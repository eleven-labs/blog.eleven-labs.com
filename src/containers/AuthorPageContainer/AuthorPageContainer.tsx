import React from 'react';

import { useAuthorPageContainer } from '@/containers/AuthorPageContainer/useAuthorPageContainer';
import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { AuthorPage } from '@/pages/AuthorPage';

export const AuthorPageContainer: React.FC = () => {
  const authorPageProps = useAuthorPageContainer();
  if (!authorPageProps) {
    return <NotFoundPageContainer />;
  }
  return <AuthorPage {...authorPageProps} />;
};
