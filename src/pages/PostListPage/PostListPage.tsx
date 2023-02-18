import { Box } from '@eleven-labs/design-system';
import React from 'react';

import { Container, NewsletterBlock, NewsletterBlockProps, PostPreviewList, PostPreviewListProps } from '@/components';

import { SubHeader, SubHeaderProps } from './SubHeader';

export type PostListPageProps = {
  subHeader: SubHeaderProps;
  postPreviewList: PostPreviewListProps;
  newsletterBlock: NewsletterBlockProps;
};

export const PostListPage: React.FC<PostListPageProps> = ({ subHeader, postPreviewList, newsletterBlock }) => (
  <Box className="post-list-page">
    <SubHeader {...subHeader} />
    <Container as="main" className="post-list-page">
      <PostPreviewList {...postPreviewList} />
      <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
    </Container>
  </Box>
);
