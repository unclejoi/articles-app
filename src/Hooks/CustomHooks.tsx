import * as React from 'react';

type Pagination = {
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
};

export const usePagination = ({
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: Pagination) => {
  const paginationRange = React.useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSibIndex = Math.max(currentPage - siblingCount, 1);
    const rightSibIndex = Math.min(currentPage + siblingCount, totalPageCount);
    const displayLeftDots = leftSibIndex > 2;
    const displayRightDots = rightSibIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!displayLeftDots && displayRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (displayLeftDots && !displayRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (displayLeftDots && displayRightDots) {
      const middleRange = range(leftSibIndex, rightSibIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index: number) => index + start);
};

export const DOTS = '...';
