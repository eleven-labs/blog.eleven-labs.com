import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

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

/** Pagination sous la liste : précédent, pages (avec ellipses) et suivant. */
export const PostCardListPager: React.FC<PostCardListPagination> = ({ currentPage, totalPages, getLink }) => {
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
