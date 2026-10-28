import type { PostCardProps } from '@/components';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostCard } from '@/components';
import { DOTS, usePagination } from '@/design-system/hooks/usePagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/design-system/ui/pagination';

export interface PostCardListPagination {
  currentPage: number;
  totalPages: number;
  /** Propriétés du lien vers une page (`href`, `onClick`…). */
  getLink: (page: number) => ComponentPropsWithoutRef<'a'>;
}

export interface PostCardListProps {
  posts: Partial<PostCardProps>[];
  pagination?: PostCardListPagination;
  isLoading?: boolean;
}

const PostCardListPager: React.FC<PostCardListPagination> = ({ currentPage, totalPages, getLink }) => {
  const pages = usePagination({ currentPage, totalPages, siblingCount: 0 });

  return (
    <Pagination className="mx-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious {...(currentPage > 1 ? getLink(currentPage - 1) : {})} />
        </PaginationItem>
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === DOTS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink {...getLink(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext {...(currentPage < totalPages ? getLink(currentPage + 1) : {})} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const PostCardList: React.FC<PostCardListProps> = ({ posts, pagination, isLoading = false }) => (
  <div className="flex flex-col gap-6">
    {posts.map((post, index) => (
      <React.Fragment key={post?.slug ?? index}>
        <PostCard {...(post || {})} isLoading={isLoading} />
      </React.Fragment>
    ))}
    {pagination && pagination.totalPages > 1 && <PostCardListPager {...pagination} />}
  </div>
);
