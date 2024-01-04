import { Box, Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, NewsletterBlock, NewsletterBlockProps, PostPreview, PostPreviewProps } from '@/components';

export type PostListPageProps = {
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
  highlightedPost?: PostPreviewProps;
  highlightedPostTitle?: string;
};

export const PostListPage: React.FC<PostListPageProps> = ({
  title,
  postPreviewList,
  newsletterBlock,
  highlightedPost,
  highlightedPostTitle,
}) => (
  <>
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
