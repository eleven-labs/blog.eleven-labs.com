import { useMemo } from 'react';

export const DOTS = -1;

interface UsePaginationOptions {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({ currentPage, totalPages, siblingCount = 2 }: UsePaginationOptions): number[] =>
  useMemo<number[]>(() => {
    const firstPageIndex = 1;

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    // If the number of pages is less than the page numbers we want to show in our paginationComponent
    if (siblingCount + 5 >= totalPages) {
      return range(firstPageIndex, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPageIndex);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    /* We do not want to show dots if there is only one position left after/before the left/right page count,
     * as that would lead to a change if our Pagination component size which we do not want
     */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, leftRange.at(-1) === totalPages - 1 ? totalPages - 1 : DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, rightRange[0] - 1 === 2 ? 2 : DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        firstPageIndex,
        middleRange[0] - 1 === 2 ? 2 : DOTS,
        ...middleRange,
        middleRange.at(-1) === totalPages - 1 ? totalPages - 1 : DOTS,
        totalPages,
      ];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);
