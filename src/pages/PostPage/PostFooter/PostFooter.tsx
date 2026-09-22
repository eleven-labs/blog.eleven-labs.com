import type { AuthorCardProps } from '@/components';
import type { BoxProps } from '@/design-system';

import React from 'react';

import { AuthorCard } from '@/components';
import { Box, Flex, Heading } from '@/design-system';

export interface PostFooterProps extends BoxProps {
  title: React.ReactNode;
  authors: AuthorCardProps[];
}

export const PostFooter: React.FC<PostFooterProps> = ({ title, authors, ...props }) => (
  <Box {...props}>
    <Heading mb="xxs" size="m" color="primary">
      {title}
    </Heading>
    <Flex mt="l" flexDirection="column" gap="s">
      {authors.map((author, authorIndex) => (
        <AuthorCard key={authorIndex} {...author} />
      ))}
    </Flex>
  </Box>
);
