import type { Meta, StoryObj } from '@storybook/react-vite';

import { postCardArgs } from '@/components/post-card/post-card.stories';

import { PostCardList } from './post-card-list';

const meta = {
  title: 'Shared/PostCardList',
  component: PostCardList,
  args: {
    posts: Array.from({ length: 7 }, () => postCardArgs),
    isLoading: false,
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto p-4" style={{ maxWidth: '47.75rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    posts: Array.from({ length: 6 }, () => ({})),
  },
};

export const WithPagination: Story = {
  args: {
    pagination: {
      currentPage: 1,
      totalPages: 20,
      getLink: (page: number) => ({ href: `#pagination?page=${page}` }),
    },
  },
};
