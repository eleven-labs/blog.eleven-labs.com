import type { RelatedPostListProps } from './RelatedPostList';
import type { Meta, StoryObj } from '@storybook/react-vite';

import * as PostCardStories from '@/components/Molecules/Cards/PostCard/PostCard.stories';

import { RelatedPostList } from './RelatedPostList';

const meta: Meta<typeof RelatedPostList> = {
  // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
  parameters: { a11y: { test: 'todo' } },
  component: RelatedPostList,
  args: {
    relatedPostListTitle: 'Articles sur le même thème',
    posts: Array.from({ length: 3 }).map(() => PostCardStories.Overview.args as RelatedPostListProps['posts'][0]),
  },
};

export default meta;
type Story = StoryObj<typeof RelatedPostList>;

export const Overview: Story = {};
