import './AuthorPage.scss';

import { AsProps, Box, Flex, Link, Text } from '@eleven-labs/design-system';
import React from 'react';

import {
  Container,
  Divider,
  NewsletterBlock,
  NewsletterBlockProps,
  PostPreviewList,
  PostPreviewListProps,
} from '@/components';

export type AuthorPageProps = {
  backLink: { label: React.ReactNode } & AsProps<'a'>;
  author: {
    username: string;
    name: string;
    avatarImageUrl?: string;
    description: string;
  };
  title: React.ReactNode;
  postPreviewList: PostPreviewListProps;
  newsletterBlock: NewsletterBlockProps;
};

export const AuthorPage: React.FC<AuthorPageProps> = ({
  backLink: { label, ...backLinkProps },
  author,
  title,
  postPreviewList,
  newsletterBlock,
}) => (
  <Container as="main" className="author-page">
    <Link {...backLinkProps} icon="arrow-back" size="m">
      {label}
    </Link>
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
        <Text as="div" size="s" dangerouslySetInnerHTML={{ __html: author.description }} />
      </Box>
    </Flex>
    <Divider mt="m" bg="light-grey" className="author-page__divider" />
    <Text size="m" my="m" fontWeight="medium">
      {title}
    </Text>
    <PostPreviewList {...postPreviewList} />
    <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
  </Container>
);
