import type { BoxProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostMetadata } from '@/components';
import { ShareLinks, type ShareLinksProps } from '@/components/Molecules/ShareLinks';
import { Box, Flex, Heading } from '@/design-system';

export interface PostHeaderProps extends BoxProps {
  title: React.ReactNode;
  date: string;
  readingTime: number;
  authors: {
    username: string;
    name: string;
    link: ComponentPropsWithoutRef<'a'>;
  }[];
  shareLinks: ShareLinksProps;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, date, readingTime, authors, shareLinks, ...props }) => (
  <Box {...props} textSize="xs">
    <Heading as="h1" size="xl" color="primary">
      {title}
    </Heading>
    <Flex flexDirection={{ xs: 'column', md: 'row' }} justifyContent="between" gap="xs" mt="m">
      <PostMetadata variant="secondary" date={date} readingTime={readingTime} authors={authors} />
      <ShareLinks {...shareLinks} />
    </Flex>
  </Box>
);
