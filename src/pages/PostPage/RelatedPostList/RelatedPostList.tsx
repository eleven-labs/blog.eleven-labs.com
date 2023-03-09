import './RelatedPostList.scss';

import { Box, BoxProps, Heading } from '@eleven-labs/design-system';
import React from 'react';

import { PostPreview, PostPreviewProps } from '@/components';

export interface RelatedPostListProps extends BoxProps {
  relatedPostListTitle: string;
  posts: ({ slug: string } & PostPreviewProps)[];
}

export const RelatedPostList: React.FC<RelatedPostListProps> = ({ relatedPostListTitle, posts, ...boxProps }) => (
  <Box {...boxProps} p="m" className="related-post-list">
    <Heading mb="m" size="m">
      {relatedPostListTitle}
    </Heading>
    {posts.map((post, index) => (
      <PostPreview key={post.slug} isRelated={true} {...post} mt="s" />
    ))}
  </Box>
);
