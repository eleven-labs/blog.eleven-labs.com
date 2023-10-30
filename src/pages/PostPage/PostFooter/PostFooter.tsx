import './PostFooter.scss';

import { Box, Flex, Link, PolymorphicPropsWithRef, polyRef, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface PostFooterProps {
  title: React.ReactNode;
  authors: {
    name: string;
    content: string;
    link: PolymorphicPropsWithRef<'a', {}>;
    avatarImageUrl?: string;
  }[];
  emptyAvatarImageUrl: string;
}

export const PostFooter = polyRef<'div', PostFooterProps>(({ title, authors, emptyAvatarImageUrl }) => (
  <Box className="post-footer" color="dark-grey" mt="m">
    <Text mb="xxs" size="xs" fontWeight="bold" textTransform="uppercase">
      {title}
    </Text>
    <Flex flexDirection={{ xs: 'column', md: 'row' }} gapY={{ md: 'xxl' }} gap="s">
      {authors.map((author, authorIndex) => (
        <Flex key={authorIndex} mb="s" className="post-footer__author">
          <img
            src={author.avatarImageUrl ?? emptyAvatarImageUrl}
            alt={author.name}
            className={author.avatarImageUrl ? 'post-footer__avatar-img' : 'post-footer__empty-avatar-img'}
          />
          <Box ml="xxs">
            <Link {...author.link} weight="medium" data-internal-link="author">
              {author.name}
            </Link>
            <Text as="div" size="xs" dangerouslySetInnerHTML={{ __html: author.content }} />
          </Box>
        </Flex>
      ))}
    </Flex>
  </Box>
));
