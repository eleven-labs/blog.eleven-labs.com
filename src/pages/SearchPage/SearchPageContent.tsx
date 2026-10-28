import type { NotFoundBlockProps } from '@/components/not-found-block';

import React from 'react';

import { NotFoundBlock } from '@/components/not-found-block';
import { Heading } from '@/design-system/ui/heading';
import { Skeleton } from '@/design-system/ui/skeleton';

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
        <Heading size="m" className="text-brand">
          {title}
        </Heading>
      </Skeleton>
      <Skeleton isLoading={isLoading}>
        <Heading size="s" className="mb-8">
          {description}
        </Heading>
      </Skeleton>
      {postCardList}
    </div>
  );
