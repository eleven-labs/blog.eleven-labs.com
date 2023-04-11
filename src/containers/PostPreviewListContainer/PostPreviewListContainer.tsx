import { useScript } from 'hoofd';
import React from 'react';

import { PostPreviewList } from '@/components';
import { getPostListDataPage } from '@/helpers/loaderDataHelper';

import { usePostPreviewListContainer } from './usePostPreviewListContainer';

export interface PostPreviewListContainerProps {
  allPosts: ReturnType<typeof getPostListDataPage>['posts'];
  isLoading?: boolean;
}

export const PostPreviewListContainer: React.FC<PostPreviewListContainerProps> = ({ allPosts, isLoading = false }) => {
  const postPreviewListProps = usePostPreviewListContainer({ allPosts, isLoading });

  useScript({
    text: `window.posts = ${JSON.stringify(allPosts)}`,
  });
  return <PostPreviewList {...postPreviewListProps} />;
};
