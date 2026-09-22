import type { Meta, StoryObj } from '@storybook/react';

import { PostMetadata } from './PostMetadata';

const meta: Meta<typeof PostMetadata> = {
  component: PostMetadata,
};

export default meta;
type Story = StoryObj<typeof PostMetadata>;

export const Overview: Story = {};
Overview.args = {
  date: '09 fév. 2021',
  readingTime: 24,
  authors: [
    { username: 'jdoe', name: 'J. Doe' },
    { username: 'jdupont', name: 'J. Dupont' },
  ],
};

export const WithVariantSecondary: Story = {};
WithVariantSecondary.args = {
  ...Overview.args,
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
  variant: 'secondary',
};

export const WithIsLoading: Story = {};
WithIsLoading.args = {
  isLoading: true,
};
