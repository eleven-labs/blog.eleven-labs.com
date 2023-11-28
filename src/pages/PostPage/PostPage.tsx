import React from 'react';

import { Container, Divider, NewsletterBlock, NewsletterBlockProps, ShareLinks } from '@/components';
import { CoverImage, CoverImageProps } from '@/components/CoverImage/CoverImage';
import { ContentTypeEnum } from '@/constants';

import { PostFooter, PostFooterProps } from './PostFooter';
import { PostHeader, PostHeaderProps } from './PostHeader';
import { RelatedPostList, RelatedPostListProps } from './RelatedPostList';
export interface PostPageProps {
  contentType: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
  backLink: React.ReactNode;
  header: Omit<PostHeaderProps, 'contentType'>;
  children: React.ReactNode;
  footer: PostFooterProps;
  newsletterBlock: NewsletterBlockProps;
  relatedPostList: RelatedPostListProps;
  className?: string;
  cover?: CoverImageProps;
}

export const PostPage: React.FC<PostPageProps> = ({
  contentType,
  backLink,
  header,
  children,
  footer,
  relatedPostList,
  newsletterBlock,
  className,
  cover,
}) => {
  const currentUrl = typeof window !== 'undefined' && window.location.href;
  return (
    <Container variant="global" className={className}>
      <Container variant="content">
        {backLink}
        {cover && <CoverImage {...cover} />}
        <PostHeader {...header} contentType={contentType} />
        <Divider mt="xs" bg="light-grey" />
        <ShareLinks urlToShare={currentUrl as string} />
        {children}
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
