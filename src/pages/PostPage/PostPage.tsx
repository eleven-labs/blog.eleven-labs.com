import { Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, Divider, NewsletterBlock, NewsletterBlockProps, ShareLinks } from '@/components';

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
}) => {
  const currentUrl = typeof window !== 'undefined' && window.location.href;

  return (
    <Container variant="global">
      <Container variant="content">
        {backLink}
        <PostHeader {...header} />
        <Divider mt="xs" bg="light-grey" />
        <ShareLinks urlToShare={currentUrl as string} />
        <Text as="section" size="s" dangerouslySetInnerHTML={{ __html: content }} />
        <ShareLinks urlToShare={currentUrl as string} />
        <Divider mt="xs" bg="light-grey" />
        <PostFooter {...footer} />
      </Container>
      <Container>
        <NewsletterBlock mb={{ xs: 'l' }} {...newsletterBlock} />
        {relatedPostList.posts.length > 0 && <RelatedPostList mb={{ xs: 'xl', md: 'xxl' }} {...relatedPostList} />}
      </Container>
    </Container>
  );
};
