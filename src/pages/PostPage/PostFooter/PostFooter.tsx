import './PostFooter.scss';

import { AsProps, Box, Flex, Link, Text } from '@eleven-labs/design-system';
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

export interface PostFooterProps {
  title: React.ReactNode;
  authors: {
    name: string;
    content: string;
    link: AsProps<'a'>;
    avatarImageUrl?: string;
  }[];
  emptyAvatarImageUrl: string;
}

const shareUrl = 'https://blog.eleven-labs.com/fr/agile-travail-distance/';

export const PostFooter: React.FC<PostFooterProps> = ({ title, authors, emptyAvatarImageUrl }) => (
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
            <Link weight="medium" {...author.link}>
              {author.name}
            </Link>
            <Text as="div" size="xs" dangerouslySetInnerHTML={{ __html: author.content }} />
          </Box>
        </Flex>
      ))}
    </Flex>
    <FacebookShareButton url={shareUrl}>
      <FacebookIcon />
    </FacebookShareButton>
    <TwitterShareButton url={shareUrl}>
      <TwitterIcon />
    </TwitterShareButton>
    <LinkedinShareButton url={shareUrl}>
      <LinkedinIcon />
    </LinkedinShareButton>
  </Box>
);
