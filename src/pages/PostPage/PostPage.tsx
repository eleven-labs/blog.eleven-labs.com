import { AsProps, Link } from '@eleven-labs/design-system';
import React from 'react';

import { Container, Divider, NewsletterBlock, NewsletterBlockProps } from '@/components';

import { PostContent } from './PostContent';
import { PostFooter, PostFooterProps } from './PostFooter';
import { PostHeader, PostHeaderProps } from './PostHeader';
import { RelatedPostList, RelatedPostListProps } from './RelatedPostList';

export interface PostPageProps {
  backLink: AsProps<'a'> & { label: React.ReactNode };
  header: PostHeaderProps;
  content: string;
  footer: PostFooterProps;
  newsletterBlock: NewsletterBlockProps;
  relatedPostList: RelatedPostListProps;
}

export const PostPage: React.FC<PostPageProps> = ({
  backLink: { label, ...backLinkProps },
  header,
  content,
  footer,
  relatedPostList,
  newsletterBlock,
}) => (
  <Container as="main">
    <Link {...backLinkProps} icon="arrow-back" size="m">
      {label}
    </Link>
    <PostHeader {...header} />
    <Divider mt="xs" bg="light-grey" />
    <PostContent content={content} />
    <Divider mt="xs" bg="light-grey" />
    <PostFooter {...footer} />
    <NewsletterBlock my={{ xs: 'l' }} {...newsletterBlock} />
    {relatedPostList.posts.length > 0 && <RelatedPostList mb={{ xs: 'xl', md: 'xxl' }} {...relatedPostList} />}
  </Container>
);
