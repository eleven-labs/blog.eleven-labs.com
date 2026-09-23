import type { Meta, StoryObj } from '@storybook/react';

import type { PostCardListProps } from '@/components';

import React from 'react';

import * as PostCardStories from '@/components/Molecules/Cards/PostCard/PostCard.stories';
import PaginationStories from '@/design-system/components/Molecules/Pagination/Pagination.stories';

import { PostCardList } from './PostCardList';

const meta: Meta<typeof PostCardList> = {
  component: PostCardList,
  args: {
    posts: Array.from({ length: 7 }).map(() => PostCardStories.Overview.args as PostCardListProps['posts'][0]),
    isLoading: false,
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [
    (Story): React.ReactElement => (
      <div className="mx-auto max-w-191 p-s">
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
  pagination: PaginationStories.args as PostCardListProps['pagination'],
};
