import type { ComponentPropsWithoutRef } from '@/design-system';
import type { PostListPageData } from '@/types';

import React from 'react';

import { PostCardList } from '@/components';

import { usePostCardListContainer } from './usePostCardListContainer';

export interface PostCardListContainerProps {
  allPosts: PostListPageData['posts'];
  withPagination?: boolean;
  currentPage?: number;
  getPaginatedLink?: (page: number) => ComponentPropsWithoutRef<'a'>;
  isLoading?: boolean;
}

export const PostCardListContainer: React.FC<PostCardListContainerProps> = ({
  allPosts,
  withPagination = true,
  currentPage = 1,
  getPaginatedLink,
  isLoading = false,
}) => {
  const postCardList = usePostCardListContainer({ allPosts, withPagination, currentPage, getPaginatedLink, isLoading });
  return <PostCardList {...postCardList} />;
};
