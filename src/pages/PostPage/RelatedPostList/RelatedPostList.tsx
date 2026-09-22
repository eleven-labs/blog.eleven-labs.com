import type { PostCardProps } from '@/components';
import type { BoxProps } from '@/design-system';

import React from 'react';

import { PostCard } from '@/components';
import { Box, Heading } from '@/design-system';

export interface RelatedPostListProps extends BoxProps {
  relatedPostListTitle: string;
  posts: PostCardProps[];
}

export const RelatedPostList: React.FC<RelatedPostListProps> = ({ relatedPostListTitle, posts, ...props }) => (
  <Box {...props}>
    <Heading mb="m" size="m" color="primary">
      {relatedPostListTitle}
    </Heading>
    {posts.map((post, index) => (
      <PostCard key={post?.slug ?? index} {...post} mt="s" />
    ))}
  </Box>
);
