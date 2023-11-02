import { Box, Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, NewsletterBlock, NewsletterBlockProps, PostPreview, PostPreviewProps } from '@/components';

import { SubHeader, SubHeaderProps } from './SubHeader';

export type PostListPageProps = {
  subHeader: SubHeaderProps;
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
  highlightedPost?: PostPreviewProps;
  highlightedPostTitle?: string;
};

export const PostListPage: React.FC<PostListPageProps> = ({
  subHeader,
  title,
  postPreviewList,
  newsletterBlock,
  highlightedPost,
  highlightedPostTitle,
}) => (
  <>
    <SubHeader {...subHeader} />
    <Container variant="global" mt={{ xs: 'l', md: 'xl' }}>
      <Container variant="content">
        {highlightedPost && (
          <Box mb="xl">
            <Text size="m" my="s" fontWeight="medium">
              {highlightedPostTitle}
            </Text>
            <PostPreview {...highlightedPost} isHighlighted />
          </Box>
        )}
        <Text size="m" my="m" fontWeight="medium">
          {title}
        </Text>
        {postPreviewList}
      </Container>
      <Container>
        <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
      </Container>
    </Container>
  </>
);
