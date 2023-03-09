import { AsProps, Heading, Link, Text } from '@eleven-labs/design-system';
import React from 'react';

import {
  Container,
  Divider,
  NewsletterBlock,
  NewsletterBlockProps,
  NotFoundBlock,
  NotFoundBlockProps,
  PostPreviewList,
  PostPreviewListProps,
} from '@/components';

export type SearchPageProps = {
  backLink: AsProps<'a'> & { label: React.ReactNode };
  title: React.ReactNode;
  description: React.ReactNode;
  postPreviewList: PostPreviewListProps;
  newsletterBlock: NewsletterBlockProps;
  searchNotFound?: NotFoundBlockProps;
};

export const SearchPage: React.FC<SearchPageProps> = ({
  backLink: { label, ...backLinkProps },
  title,
  description,
  postPreviewList,
  newsletterBlock,
  searchNotFound,
}) => (
  <>
    <Container as="main" className="search-page">
      <Link {...backLinkProps} icon="arrow-back" size="m">
        {label}
      </Link>
      {postPreviewList.posts.length === 0 && searchNotFound ? (
        <NotFoundBlock {...searchNotFound} />
      ) : (
        <>
          <Heading mt="s" size="l">
            {title}
          </Heading>
          <Text size="s">{description}</Text>
          <Divider mt="xs" mb="l" size="l" mx="0" bg="yellow" />
          <PostPreviewList {...postPreviewList} />
          <NewsletterBlock my={{ xs: 'xl', md: 'xxl' }} {...newsletterBlock} />
        </>
      )}
    </Container>
  </>
);
