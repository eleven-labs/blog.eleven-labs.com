import type { Meta, StoryObj } from '@storybook/react-vite';

import * as React from 'react';

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

const meta = {
  title: 'UI/Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const getHref = (page: number): string => `#page-${page}`;

/** Assemble les cases à partir du hook `usePagination`, comme la liste d'articles du blog. */
const PaginationExample: React.FC<{
  currentPage: number;
  totalPages: number;
}> = ({ currentPage, totalPages }) => {
  const pages = usePagination({ currentPage, totalPages, siblingCount: 0 });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={currentPage > 1 ? getHref(currentPage - 1) : undefined} />
        </PaginationItem>
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === DOTS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={getHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={currentPage < totalPages ? getHref(currentPage + 1) : undefined} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const FirstPage: Story = {
  render: () => <PaginationExample currentPage={1} totalPages={20} />,
};

export const MiddlePage: Story = {
  render: () => <PaginationExample currentPage={10} totalPages={20} />,
};

export const LastPage: Story = {
  render: () => <PaginationExample currentPage={20} totalPages={20} />,
};
