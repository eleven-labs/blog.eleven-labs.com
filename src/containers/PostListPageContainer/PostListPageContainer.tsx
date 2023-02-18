import React from 'react';

import { PostListPage } from '@/pages/PostListPage/PostListPage';

import { usePostListPageContainer } from './usePostListPageContainer';

export const PostListPageContainer: React.FC = () => {
  const postListPageProps = usePostListPageContainer();
  return <PostListPage {...postListPageProps} />;
};
