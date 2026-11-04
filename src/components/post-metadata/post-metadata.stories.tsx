import type { Meta, StoryObj } from '@storybook/react-vite';

import { PostMetadata } from './post-metadata';

const meta = {
  title: 'Shared/PostMetadata',
  component: PostMetadata,
  args: {
    date: '9 févr. 2021',
    readingTime: { label: '24 min', dateTime: 'PT24M' },
    authors: [
      { username: 'mdupont', name: 'M. Dupont' },
      { username: 'jmartin', name: 'J. Martin' },
    ],
  },
} satisfies Meta<typeof PostMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    authors: [
      { username: 'mdupont', name: 'M. Dupont', link: { href: '/fr/authors/mdupont' } },
      { username: 'jmartin', name: 'J. Martin', link: { href: '/fr/authors/jmartin' } },
    ],
  },
};

export const OnlyDate: Story = {
  args: { displayedFields: ['date'] },
};

export const Loading: Story = {
  args: { isLoading: true },
};
