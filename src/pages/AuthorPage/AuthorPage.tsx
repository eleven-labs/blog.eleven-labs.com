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
    description: string;
  };
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
};

export const AuthorPage: React.FC<AuthorPageProps> = ({
  backLink,
  author,
  title,
  postPreviewList,
  newsletterBlock,
}) => (
  <Container className="author-page">
    <Box partial-hydrate="back-link-container">{backLink}</Box>
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      textAlign={{ xs: 'center', md: 'left' }}
      mt={{ xs: 'm' }}
    >
      <img src={author.avatarImageUrl} alt={author.name} className="author-page__avatar_img" />
      <Box mt={{ xs: 's' }} ml={{ xs: 'm' }}>
        <Text size="m" fontWeight="medium" color="amaranth">
          {author.name}
        </Text>
        <Box dangerouslySetInnerHTML={{ __html: author.description }} />
      </Box>
    </Flex>
    <Divider mt="m" bg="light-grey" className="author-page__divider" />
    <Text size="m" my="m" fontWeight="medium">
      {title}
    </Text>
    <Box partial-hydrate="post-preview-container">{postPreviewList}</Box>
    <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
  </Container>
);
