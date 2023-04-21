import { Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, NewsletterBlock, NewsletterBlockProps } from '@/components';

import { SubHeader, SubHeaderProps } from './SubHeader';

export type PostListPageProps = {
  subHeader: SubHeaderProps;
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
};

export const PostListPage: React.FC<PostListPageProps> = ({ subHeader, title, postPreviewList, newsletterBlock }) => (
  <>
    <SubHeader {...subHeader} />
    <Container>
      <Text size="m" my="m" fontWeight="medium">
        {title}
      </Text>
      {postPreviewList}
      <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
    </Container>
  </>
);
