import { PostCardList } from '@eleven-labs/design-system';
import React from 'react';

import { PostListPageData } from '@/types';

import { usePostCardListContainer } from './usePostCardListContainer';

export interface PostCardListContainerProps {
  allPosts: PostListPageData['posts'];
  currentPage?: number;
  getPaginatedLink?: (page: number) => React.ComponentPropsWithoutRef<'a'>;
  isLoading?: boolean;
}

export const PostCardListContainer: React.FC<PostCardListContainerProps> = ({
  allPosts,
  currentPage = 1,
  getPaginatedLink,
  isLoading = false,
}) => {
  const postCardList = usePostCardListContainer({ allPosts, currentPage, getPaginatedLink, isLoading });
  return <PostCardList {...postCardList} />;
};
