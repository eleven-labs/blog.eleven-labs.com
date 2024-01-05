import { Box, BoxProps, Flex, Heading } from '@eleven-labs/design-system';
import React from 'react';

import { AuthorBlock } from '@/components';

export interface PostFooterProps extends BoxProps {
  title: React.ReactNode;
  authors: {
    name: string;
    content: string;
    link: React.ComponentPropsWithoutRef<'a'>;
    avatarImageUrl?: string;
  }[];
}

export const PostFooter: React.FC<PostFooterProps> = ({ title, authors, ...props }) => (
  <Box {...props}>
    <Heading mb="xxs" size="l" fontWeight="bold" color="navy">
      {title}
    </Heading>
    <Flex flexDirection="column" gap="s">
      {authors.map((author, authorIndex) => (
        <AuthorBlock
          key={authorIndex}
          name={author.name}
          avatarImageUrl={author.avatarImageUrl}
          description={author.content}
          link={author.link}
        />
      ))}
    </Flex>
  </Box>
);
