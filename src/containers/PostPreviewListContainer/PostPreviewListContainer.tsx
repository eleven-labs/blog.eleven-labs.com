import React from 'react';

import { PostPreviewList } from '@/components';
import { type getDataFromPostListPage } from '@/helpers/contentHelper';

import { usePostPreviewListContainer } from './usePostPreviewListContainer';

export interface PostPreviewListContainerProps {
  allPosts: ReturnType<typeof getDataFromPostListPage>['posts'];
  isLoading?: boolean;
}

export const PostPreviewListContainer: React.FC<PostPreviewListContainerProps> = ({ allPosts, isLoading = false }) => {
  const postPreviewListProps = usePostPreviewListContainer({ allPosts, isLoading });
  return <PostPreviewList {...postPreviewListProps} />;
};
