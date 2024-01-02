import { Heading, Skeleton, Text } from '@eleven-labs/design-system';
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
  title: React.ReactNode;
  description: React.ReactNode;
  postPreviewList: React.ReactNode;
  newsletterBlock: NewsletterBlockProps;
  searchNotFound?: NotFoundBlockProps;
  isLoading?: boolean;
};

export const SearchPage: React.FC<SearchPageProps> = ({
  title,
  description,
  postPreviewList,
  newsletterBlock,
  searchNotFound,
  isLoading = false,
}) => (
  <Container variant="global">
    {!isLoading && searchNotFound ? (
      <NotFoundBlock {...searchNotFound} />
    ) : (
      <>
        <Container variant="content" className="search-page">
          <Skeleton isLoading={isLoading}>
            <Heading as="p" mt="s" size="l">
              {title}
            </Heading>
          </Skeleton>
          <Skeleton isLoading={isLoading}>
            <Text size="s">{description}</Text>
          </Skeleton>
          <Divider mt="xs" mb="l" size="l" mx="0" bg="yellow" />
          {postPreviewList}
        </Container>
        <Container>
          <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
        </Container>
      </>
    )}
  </Container>
);
