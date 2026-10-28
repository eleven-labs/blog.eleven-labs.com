import type { Meta, StoryObj } from '@storybook/react-vite';

import type { PostCardListProps } from '@/components';

import React from 'react';

import * as PostCardStories from '@/components/Molecules/Cards/PostCard/PostCard.stories';

import { PostCardList } from './PostCardList';

const meta: Meta<typeof PostCardList> = {
  component: PostCardList,
  args: {
    posts: Array.from({ length: 7 }).map(() => PostCardStories.Overview.args as PostCardListProps['posts'][0]),
    isLoading: false,
  },
  parameters: {
    // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
    a11y: { test: 'todo' },
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [
    (Story): React.ReactElement => (
      <div className="max-w-191 mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCardList>;

export const Overview: Story = {};

export const WithIsLoading: Story = {};
WithIsLoading.args = {
  isLoading: true,
  posts: Array.from({ length: 6 }),
};

export const WithPagination: Story = {};
WithPagination.args = {
  pagination: {
    currentPage: 1,
    totalPages: 20,
    getLink: (page: number) => ({ href: `#pagination?page=${page}` }),
  },
};
