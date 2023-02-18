import { Box, Button, Flex, Text } from '@eleven-labs/design-system';
import React from 'react';

import { Divider, PostPreview, PostPreviewProps, ProgressBar } from '@/components';

export interface PostPreviewListProps {
  title: React.ReactNode;
  posts: PostPreviewProps[];
  pagination?: {
    textNumberOfPosts: React.ReactNode;
    numberOfPosts: number;
    maxNumberOfPosts: number;
    loadMoreButtonLabel: React.ReactNode;
    onLoadMore: () => void;
  };
}

export const PostPreviewList: React.FC<PostPreviewListProps> = ({ title, posts, pagination }) => {
  return (
    <Box>
      <Text size="m" my="m" fontWeight="medium">
        {title}
      </Text>
      {posts.map((post, index) => (
        <React.Fragment key={index}>
          <PostPreview hasMask={Boolean(pagination && index === posts.length - 1)} {...post} />
          {posts.length - 1 !== index && <Divider my="m" bg="light-grey" />}
          {posts.length - 1 === index && pagination && <Divider size="m" my="m" mx={{ md: 'xl' }} bg="azure" />}
        </React.Fragment>
      ))}
      {pagination && (
        <>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Text size="s">{pagination.textNumberOfPosts}</Text>
            <ProgressBar mt="xxs" value={pagination.numberOfPosts} max={pagination.maxNumberOfPosts} />
            <Button my="s" onClick={pagination.onLoadMore}>
              {pagination.loadMoreButtonLabel}
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};
