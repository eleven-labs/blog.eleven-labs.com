import { renderHook } from '@testing-library/react';

import { DOTS, usePagination } from './usePagination';

describe('usePagination', () => {
  it('should return an empty array when page count is 0', () => {
    const { result } = renderHook(() => usePagination({ currentPage: 1, totalPages: 0 }));
    expect(result.current).toEqual([]);
  });

  it('should return an array with page numbers when page count is less than or equal to the total page numbers to show', () => {
    const { result } = renderHook(() => usePagination({ currentPage: 1, totalPages: 3 }));
    expect(result.current).toEqual([1, 2, 3]);

    const { result: result2 } = renderHook(() => usePagination({ currentPage: 3, totalPages: 5 }));
    expect(result2.current).toEqual([1, 2, 3, 4, 5]);
  });

  it.each([
    { currentPage: 5, totalPages: 10, expected: [1, 2, 3, 4, 5, 6, 7, DOTS, 10] },
    { currentPage: 8, totalPages: 10, expected: [1, DOTS, 4, 5, 6, 7, 8, 9, 10] },
    { currentPage: 10, totalPages: 20, expected: [1, DOTS, 8, 9, 10, 11, 12, DOTS, 20] },
  ])(
    'should return an array with page numbers and dots when page count is greater than the total page numbers to show',
    ({ currentPage, totalPages, expected }) => {
      const { result } = renderHook(() => usePagination({ currentPage, totalPages }));
      expect(result.current).toEqual(expected);
    }
  );

  it('should return an array with page numbers and dots when page count is greater than the total page numbers to show, with custom sibling count', () => {
    const { result: resultWithSiblingCount1 } = renderHook(() =>
      usePagination({ currentPage: 5, totalPages: 10, siblingCount: 1 })
    );
    expect(resultWithSiblingCount1.current).toEqual([1, DOTS, 4, 5, 6, DOTS, 10]);

    const { result: resultWithSiblingCount3 } = renderHook(() =>
      usePagination({ currentPage: 10, totalPages: 20, siblingCount: 3 })
    );
    expect(resultWithSiblingCount3.current).toEqual([1, DOTS, 7, 8, 9, 10, 11, 12, 13, DOTS, 20]);
  });
});
