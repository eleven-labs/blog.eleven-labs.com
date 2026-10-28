import type { RelatedPostListProps } from './RelatedPostList';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { postCardArgs } from '@/components/post-card/post-card.stories';

import { RelatedPostList } from './RelatedPostList';

const meta: Meta<typeof RelatedPostList> = {
  title: 'Features/Post/RelatedPostList',
  component: RelatedPostList,
  args: {
    relatedPostListTitle: 'Articles sur le même thème',
    posts: Array.from({ length: 3 }).map(() => postCardArgs as RelatedPostListProps['posts'][0]),
  },
};

export default meta;
type Story = StoryObj<typeof RelatedPostList>;

export const Overview: Story = {};
