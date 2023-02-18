import React from 'react';

import { NotFoundPageContainer } from '@/containers/NotFoundPageContainer';
import { PostPage } from '@/pages/PostPage';

import { usePostPageContainer } from './usePostPageContainer';

export const PostPageContainer: React.FC = () => {
  const postPageProps = usePostPageContainer();
  if (!postPageProps) {
    return <NotFoundPageContainer />;
  }
  return <PostPage {...postPageProps} />;
};
