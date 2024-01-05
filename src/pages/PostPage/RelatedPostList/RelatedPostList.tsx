import { Box, BoxProps, Heading } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreview, PostPreviewProps } from '@/components';

export interface RelatedPostListProps extends BoxProps {
  relatedPostListTitle: string;
  posts: PostPreviewProps[];
}

export const RelatedPostList: React.FC<RelatedPostListProps> = ({ relatedPostListTitle, posts, ...boxProps }) => (
  <Box {...boxProps} p="m">
    <Heading as="p" mb="m" size="m" color="navy">
      {relatedPostListTitle}
    </Heading>
    {posts.map((post, index) => (
      <PostPreview key={post?.slug ?? index} {...post} mt="s" />
    ))}
  </Box>
);
