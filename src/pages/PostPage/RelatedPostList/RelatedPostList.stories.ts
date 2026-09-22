import type { RelatedPostListProps } from './RelatedPostList';
import type { Meta, StoryObj } from '@storybook/react';

import * as PostCardStories from '@/components/Molecules/Cards/PostCard/PostCard.stories';

import { RelatedPostList } from './RelatedPostList';

const meta: Meta<typeof RelatedPostList> = {
  component: RelatedPostList,
  args: {
    relatedPostListTitle: 'Articles sur le même thème',
    posts: Array.from({ length: 3 }).map(() => PostCardStories.Overview.args as RelatedPostListProps['posts'][0]),
  },
};

export default meta;
type Story = StoryObj<typeof RelatedPostList>;

export const Overview: Story = {};
