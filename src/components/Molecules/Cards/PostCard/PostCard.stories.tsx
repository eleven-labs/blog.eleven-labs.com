import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { PostCard } from './PostCard';

const meta: Meta<typeof PostCard> = {
  component: PostCard,
  parameters: {
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const Overview: Story = {};
Overview.args = {
  contentType: 'article',
  cover: {
    img: {
      src: '/imgs/default-cover.jpg',
      alt: 'cover',
    },
  },
  title: `Phasellus quis mollis ex. Nullam tristique nisl eu orci ullamcorper hendrerit vestibulum elementum metus nulla, scelerisque finibus`,
  date: '09 fév. 2021',
  readingTime: 24,
  authors: [
    { username: 'jdoe', name: 'John Doe' },
    { username: 'jdupont', name: 'Jane Dupont' },
  ],
  excerpt:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur cursus tempor suscipit. Fusce ac sapien sit amet velit auctor dapibus. Maecenas dui sem, suscipit sagittis leo eget, porta euismod enim.',
  link: {
    href: '#',
  },
};

export const WithVariantHighlightLight: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '380px' }}>
        <Story />
      </div>
    ),
  ],
};
WithVariantHighlightLight.args = {
  ...Overview.args,
  variant: 'highlight-light',
};

export const WithVariantHighlightDark: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
WithVariantHighlightDark.args = {
  ...Overview.args,
  variant: 'highlight-dark',
};

export const WithVariantSideImage: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '764px' }}>
        <Story />
      </div>
    ),
  ],
};
WithVariantSideImage.args = {
  ...Overview.args,
  variant: 'side-image',
};
WithVariantHighlightDark.parameters = {
  backgrounds: { default: 'primary' },
};

export const WithContentTypeTutorial: Story = {};
WithContentTypeTutorial.args = {
  ...Overview.args,
  contentType: 'tutorial',
  tutorialLabel: 'Tutoriel',
};

export const WithIsLoading: Story = {};
WithIsLoading.args = {
  isLoading: true,
};
