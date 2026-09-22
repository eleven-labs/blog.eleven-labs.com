import type { PostCardProps } from '@/components';
import type { BoxProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components';
import { Box, Button, Flex, Heading } from '@/design-system';

import './LastArticlesBlock.scss';

export interface LastArticlesBlockProps extends BoxProps {
  title: React.ReactNode;
  posts: Partial<PostCardProps>[];
  linkSeeMore: { label: string } & ComponentPropsWithoutRef<'a'>;
}

export const LastArticlesBlock: React.FC<LastArticlesBlockProps> = ({
  title,
  posts,
  linkSeeMore: { label: labelLinkSeeMore, ...linkSeeMore },
  ...props
}) => (
  <Box {...props} my="xl" className="last-articles-block container-content">
    <Heading size="m" color="primary">
      {title}
    </Heading>
    <Flex mt="l" gap="m" className="last-articles-block__post-list">
      {posts.map((post, index) => (
        <React.Fragment key={post?.slug ?? index}>
          <PostCard variant="highlight-light" {...(post || {})} />
        </React.Fragment>
      ))}
    </Flex>
    <Flex justifyContent="center" alignItems="center">
      <Button mt="l" as="a" {...linkSeeMore}>
        {labelLinkSeeMore}
      </Button>
    </Flex>
  </Box>
);
