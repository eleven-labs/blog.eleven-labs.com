import { Box } from '@eleven-labs/design-system';
import React from 'react';

import { Container, Divider, NewsletterBlock, NewsletterBlockProps } from '@/components';

import { PostFooter, PostFooterProps } from './PostFooter';
import { PostHeader, PostHeaderProps } from './PostHeader';
import { RelatedPostList, RelatedPostListProps } from './RelatedPostList';

export interface PostPageProps {
  backLink: React.ReactNode;
  header: PostHeaderProps;
  content: string;
  footer: PostFooterProps;
  newsletterBlock: NewsletterBlockProps;
  relatedPostList: RelatedPostListProps;
}

export const PostPage: React.FC<PostPageProps> = ({
  backLink,
  header,
  content,
  footer,
  relatedPostList,
  newsletterBlock,
}) => (
  <Container>
    <Box partial-hydrate="back-link-container">{backLink}</Box>
    <PostHeader {...header} />
    <Divider mt="xs" bg="light-grey" />
    <Box as="section" textSize="s" dangerouslySetInnerHTML={{ __html: content }} />
    <Divider mt="xs" bg="light-grey" />
    <PostFooter {...footer} />
    <NewsletterBlock my={{ xs: 'l' }} {...newsletterBlock} />
    {relatedPostList.posts.length > 0 && <RelatedPostList mb={{ xs: 'xl', md: 'xxl' }} {...relatedPostList} />}
  </Container>
);
