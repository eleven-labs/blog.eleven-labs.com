import type { Meta, StoryObj } from '@storybook/react';

import ShareLinksStories from '@/components/Molecules/ShareLinks/ShareLinks.stories';

import { PostHeader, type PostHeaderProps } from './PostHeader';

const meta: Meta<typeof PostHeader> = {
  component: PostHeader,
  args: {
    title: 'Title',
    date: '08 fév. 2021',
    readingTime: { label: '24 min', dateTime: 'PT24M' },
    authors: [
      {
        username: 'jdoe',
        name: 'J. Doe',
        link: {
          href: '/fr/authors/jdoe',
        },
      },
      {
        username: 'jdupont',
        name: 'J. Dupont',
        link: {
          href: '/fr/authors/jdupont',
        },
      },
    ],
    shareLinks: ShareLinksStories.args as PostHeaderProps['shareLinks'],
  },
};

export default meta;
type Story = StoryObj<typeof PostHeader>;

export const Overview: Story = {};
