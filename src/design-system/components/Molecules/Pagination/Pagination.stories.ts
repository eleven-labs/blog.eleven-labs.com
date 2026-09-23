import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  args: {
    currentPage: 1,
    totalPages: 20,
    siblingCount: 0,
    getLink: (page: number) => ({
      href: `#pagination?page=${page}`,
    }),
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Overview: Story = {};
