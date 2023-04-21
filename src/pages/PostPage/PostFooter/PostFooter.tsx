import './PostFooter.scss';

import { AsProps, Box, Flex, Link, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface PostFooterProps {
  title: React.ReactNode;
  authors: {
    name: string;
    content: string;
    link: AsProps<'a'>;
    avatarImageUrl?: string;
  }[];
}

export const PostFooter: React.FC<PostFooterProps> = ({ title, authors }) => (
  <Box className="post-footer" color="dark-grey" mt="m">
    <Text mb="xxs" size="xs" fontWeight="bold" textTransform="uppercase">
      {title}
    </Text>
    <Flex flexDirection={{ xs: 'column', md: 'row' }} gapY={{ md: 'xxl' }} gap="s">
      {authors.map((author, authorIndex) => (
        <Flex key={authorIndex} mb="s" className="post-footer__author">
          <img src={author.avatarImageUrl} alt={author.name} className="post-footer__avatar_img" />
          <Box ml="xxs">
            <Link weight="medium" {...author.link}>
              {author.name}
            </Link>
            <Text as="div" size="xs" dangerouslySetInnerHTML={{ __html: author.content }} />
          </Box>
        </Flex>
      ))}
    </Flex>
  </Box>
);
