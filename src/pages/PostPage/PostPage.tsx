import React from 'react';

import { ContactBlock, ContactBlockProps, Container, Divider, ShareLinks } from '@/components';
import { ContentTypeEnum } from '@/constants';

import { PostFooter, PostFooterProps } from './PostFooter';
import { PostHeader, PostHeaderProps } from './PostHeader';
import { RelatedPostList, RelatedPostListProps } from './RelatedPostList';

export interface PostPageProps {
  contentType: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
  header: Omit<PostHeaderProps, 'contentType'>;
  children: React.ReactNode;
  footer: PostFooterProps;
  contactBlock: ContactBlockProps;
  relatedPostList: RelatedPostListProps;
  className?: string;
}

export const PostPage: React.FC<PostPageProps> = ({
  contentType,
  header,
  children,
  footer,
  relatedPostList,
  contactBlock,
  className,
}) => {
  const currentUrl = typeof window !== 'undefined' && window.location.href;

  return (
    <Container variant="global" className={className}>
      <Container variant="content">
        <PostHeader {...header} contentType={contentType} />
        <Divider mt="xs" bg="light-grey" />
        <ShareLinks urlToShare={currentUrl as string} />
        {children}
        <ShareLinks urlToShare={currentUrl as string} />
        <Divider mt="xs" bg="light-grey" />
        <PostFooter {...footer} />
        <ContactBlock mb={{ xs: 'l' }} {...contactBlock} />
      </Container>
      <Container>
        {relatedPostList.posts.length > 0 && <RelatedPostList mb={{ xs: 'xl', md: 'xxl' }} {...relatedPostList} />}
      </Container>
    </Container>
  );
};
