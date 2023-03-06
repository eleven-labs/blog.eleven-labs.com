import { Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, NewsletterBlock, NewsletterBlockProps, PostPreviewList, PostPreviewListProps } from '@/components';

import { SubHeader, SubHeaderProps } from './SubHeader';

export type PostListPageProps = {
  subHeader: SubHeaderProps;
  title: React.ReactNode;
  postPreviewList: PostPreviewListProps;
  newsletterBlock: NewsletterBlockProps;
};

export const PostListPage: React.FC<PostListPageProps> = ({ subHeader, title, postPreviewList, newsletterBlock }) => (
  <>
    <SubHeader {...subHeader} />
    <Container as="main">
      <Text size="m" my="m" fontWeight="medium">
        {title}
      </Text>
      <PostPreviewList {...postPreviewList} />
      <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
    </Container>
  </>
);
