import type { Meta, StoryObj } from '@storybook/react-vite';

import type { PostCardListProps } from '@/components/post-card-list';
import type { CategoryPageProps } from '@/pages/CategoryPage';

import React from 'react';

import NewsletterCardStories from '@/components/newsletter-card/newsletter-card.stories';
import { PostCardList } from '@/components/post-card-list';
import * as PostCardListStories from '@/components/post-card-list/post-card-list.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { AuthorPage } from './AuthorPage';

const meta: Meta<typeof AuthorPage> = {
  component: AuthorPage,
  args: {
    author: {
      username: 'jdoe',
      name: 'John Doe',
      content: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
      socialNetworks: [
        {
          name: 'github',
          url: 'https://github.com/mytwitter/',
          username: 'mygithub',
        },
        {
          name: 'twitter',
          url: 'https://twitter.com/mytwitter/',
          username: 'mytwitter',
        },
        {
          name: 'linkedin',
          url: 'https://www.linkedin.com/in/mylinkedin/',
          username: 'mylinkedin',
        },
      ],
    },
    title: `Article de l'auteur`,
    postCardList: React.createElement<PostCardListProps>(PostCardList, {
      ...PostCardListStories.default.args,
      ...PostCardListStories.WithPagination.args,
    } as PostCardListProps),
    newsletterCard: NewsletterCardStories.args as CategoryPageProps['newsletterCard'],
  },
  parameters: {
    // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
    a11y: { test: 'todo' },
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
};

export default meta;
type Story = StoryObj<typeof AuthorPage>;

export const Overview: Story = {};
