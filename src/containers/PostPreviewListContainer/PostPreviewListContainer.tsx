import React from 'react';

import { PostPreviewList } from '@/components';
import { PostListPageData } from '@/types';

import { usePostPreviewListContainer } from './usePostPreviewListContainer';

export interface PostPreviewListContainerProps {
  allPosts: PostListPageData['posts'];
  isLoading?: boolean;
}

export const PostPreviewListContainer: React.FC<PostPreviewListContainerProps> = ({ allPosts, isLoading = false }) => {
  const postPreviewListProps = usePostPreviewListContainer({ allPosts, isLoading });
  return <PostPreviewList {...postPreviewListProps} />;
};
