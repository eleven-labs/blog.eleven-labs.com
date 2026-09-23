import type { NotFoundBlockProps } from '@/components';

import React from 'react';

import { NotFoundBlock } from '@/components';
import { Heading, Skeleton } from '@/design-system';

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
    <div>
      <Skeleton isLoading={isLoading}>
        <Heading size="m" className="text-primary">
          {title}
        </Heading>
      </Skeleton>
      <Skeleton isLoading={isLoading}>
        <Heading size="s" className="mb-l">
          {description}
        </Heading>
      </Skeleton>
      {postCardList}
    </div>
  );
