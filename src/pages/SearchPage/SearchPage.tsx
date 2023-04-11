import { Box, Heading, Skeleton, Text } from '@eleven-labs/design-system';
import React from 'react';

import {
  Container,
  Divider,
  NewsletterBlock,
  NewsletterBlockProps,
  NotFoundBlock,
  NotFoundBlockProps,
} from '@/components';

export type SearchPageProps = {
  backLink: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
  searchNotFound?: NotFoundBlockProps;
  isLoading?: boolean;
};

export const SearchPage: React.FC<SearchPageProps> = ({
  backLink,
  title,
  description,
  postPreviewList,
  newsletterBlock,
  searchNotFound,
  isLoading = false,
}) => (
  <>
    <Container as="main" className="search-page">
      <Box partial-hydrate="back-link-container">{backLink}</Box>
      {!isLoading && searchNotFound ? (
        <NotFoundBlock {...searchNotFound} />
      ) : (
        <>
          <Skeleton isLoading={isLoading}>
            <Heading mt="s" size="l">
              {title}
            </Heading>
          </Skeleton>
          <Skeleton isLoading={isLoading}>
            <Text size="s">{description}</Text>
          </Skeleton>
          <Divider mt="xs" mb="l" size="l" mx="0" bg="yellow" />
          <Box partial-hydrate="post-preview-container">{postPreviewList}</Box>
          <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
        </>
      )}
    </Container>
  </>
);
