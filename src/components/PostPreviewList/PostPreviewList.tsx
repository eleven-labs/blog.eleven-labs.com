import { Box, Button, Flex, Text } from '@eleven-labs/design-system';
import React from 'react';

import { Divider, PostPreview, PostPreviewProps, ProgressBar } from '@/components';

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
  highlightedPost?: PostPreviewProps;
}

export const PostPreviewList: React.FC<PostPreviewListProps> = ({
  posts,
  pagination,
  isLoading = false,
  highlightedPost,
}) => (
  <>
    {highlightedPost && (
      <Box my="m">
        <PostPreview {...highlightedPost} />
      </Box>
    )}
    {posts.map((post, index) => (
      <React.Fragment key={index}>
        <PostPreview
          hasMask={Boolean(pagination && index === posts.length - 1)}
          {...(post || {})}
          isLoading={isLoading}
        />
        {posts.length - 1 !== index && <Divider my="m" bg="light-grey" />}
        {posts.length - 1 === index && pagination && <Divider size="m" my="m" mx={{ md: 'xl' }} bg="azure" />}
      </React.Fragment>
    ))}
    {pagination && (
      <>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text size="s">{pagination.textNumberOfPosts}</Text>
          <ProgressBar mt="xxs" value={pagination.numberOfPosts} max={pagination.maxNumberOfPosts} />
          <Button my="s" onClick={pagination.onLoadMore} data-button="loadMore">
            {pagination.loadMoreButtonLabel}
          </Button>
        </Flex>
      </>
    )}
  </>
);
