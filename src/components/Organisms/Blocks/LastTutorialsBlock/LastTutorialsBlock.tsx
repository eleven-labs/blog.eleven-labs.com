import type { PostCardProps } from '@/components';
import type { FlexProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components';
import { Icon, Flex, Box, Button, Heading, Text } from '@/design-system';

import './LastTutorialsBlock.scss';

export interface LastTutorialsBlockProps extends FlexProps {
  title: React.ReactNode;
  description: React.ReactNode;
  posts: Partial<PostCardProps>[];
  tutorialLabel: string;
  linkSeeMore: { label: string } & ComponentPropsWithoutRef<'a'>;
}

export const LastTutorialsBlock: React.FC<LastTutorialsBlockProps> = ({
  title,
  description,
  tutorialLabel,
  posts,
  linkSeeMore: { label: labelLinkSeeMore, ...linkSeeMore },
  ...props
}) => (
  <Box bg="primary" color="white">
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      {...props}
      py="xl"
      mx={{ xs: 's', md: 'auto' }}
      gap="xl"
      className="last-tutorials-block container-content"
    >
      <Box className="last-tutorials-block__content">
        <Heading size="m">{title}</Heading>
        <Icon name="underline" color="white" width="56px" />
        <Text mt="l">{description}</Text>
        <Button mt="l" as="a" variant="accent" {...linkSeeMore}>
          {labelLinkSeeMore}
        </Button>
      </Box>
      <Flex gap="l" className="last-tutorials-block__post-list">
        {posts.map((post, index) => (
          <React.Fragment key={post?.slug ?? index}>
            <PostCard variant="highlight-dark" tutorialLabel={tutorialLabel} {...(post || {})} />
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  </Box>
);
