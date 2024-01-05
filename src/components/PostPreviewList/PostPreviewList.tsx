import { Button, Flex, Text } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreview, PostPreviewProps, ProgressBar } from '@/components';

export interface PostPreviewListProps {
  posts: Partial<PostPreviewProps>[];
  pagination?: {
    textNumberOfPosts: React.ReactNode;
    numberOfPosts: number;
    maxNumberOfPosts: number;
    loadMoreButtonLabel: React.ReactNode;
    onLoadMore: () => void;
  };
  isLoading?: boolean;
}

export const PostPreviewList: React.FC<PostPreviewListProps> = ({ posts, pagination, isLoading = false }) => (
  <>
    <Flex flexDirection="column" gap="m">
      {posts.map((post, index) => (
        <React.Fragment key={post?.slug ?? index}>
          <PostPreview {...(post || {})} isLoading={isLoading} />
        </React.Fragment>
      ))}
    </Flex>
    {pagination && (
      <Flex flexDirection="column" justifyContent="center" alignItems="center" mt="l">
        <Text size="s">{pagination.textNumberOfPosts}</Text>
        <ProgressBar mt="xxs" value={pagination.numberOfPosts} max={pagination.maxNumberOfPosts} />
        <Button my="s" onClick={pagination.onLoadMore} data-button="loadMore">
          {pagination.loadMoreButtonLabel}
        </Button>
      </Flex>
    )}
  </>
);
