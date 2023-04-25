import './AuthorPage.scss';

import { Box, Flex, Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, Divider, NewsletterBlock, NewsletterBlockProps } from '@/components';

export type AuthorPageProps = {
  backLink: React.ReactNode;
  author: {
    username: string;
    name: string;
    avatarImageUrl?: string;
    content: string;
  };
  emptyAvatarImageUrl: string;
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
};

export const AuthorPage: React.FC<AuthorPageProps> = ({
  backLink,
  author,
  emptyAvatarImageUrl,
  title,
  postPreviewList,
  newsletterBlock,
}) => (
  <Container className="author-page">
    {backLink}
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      textAlign={{ xs: 'center', md: 'left' }}
      mt="m"
    >
      <img
        src={author.avatarImageUrl ?? emptyAvatarImageUrl}
        alt={author.name}
        className={author.avatarImageUrl ? 'author-page__avatar-img' : 'author-page__empty-avatar-img'}
      />
      <Box mt="s" ml="s">
        <Text size="m" fontWeight="medium" color="amaranth">
          {author.name}
        </Text>
        <Box dangerouslySetInnerHTML={{ __html: author.content }} />
      </Box>
    </Flex>
    <Divider mt="m" bg="light-grey" className="author-page__divider" />
    <Text size="m" my="m" fontWeight="medium">
      {title}
    </Text>
    {postPreviewList}
    <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
  </Container>
);
