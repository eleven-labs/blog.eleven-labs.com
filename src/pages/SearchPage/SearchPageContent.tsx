import type { NotFoundBlockProps } from '@/components';

import React from 'react';

import { NotFoundBlock } from '@/components';
import { Box, Heading, Skeleton } from '@/design-system';

export type SearchPageContentProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  postCardList: React.ReactNode;
  searchNotFound?: NotFoundBlockProps;
  isLoading?: boolean;
};

export const SearchPageContent: React.FC<SearchPageContentProps> = ({
  title,
  description,
  postCardList,
  searchNotFound,
  isLoading = false,
}) =>
  !isLoading && searchNotFound ? (
    <NotFoundBlock {...searchNotFound} />
  ) : (
    <Box>
      <Skeleton isLoading={isLoading}>
        <Heading size="m" fontWeight="medium" color="primary">
          {title}
        </Heading>
      </Skeleton>
      <Skeleton isLoading={isLoading}>
        <Heading size="s" mb="l">
          {description}
        </Heading>
      </Skeleton>
      {postCardList}
    </Box>
  );
