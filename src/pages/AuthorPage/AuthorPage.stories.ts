import type { Meta, StoryObj } from '@storybook/react';

import type { PostCardListProps } from '@/components';
import type { CategoryPageProps } from '@/pages/CategoryPage';

import React from 'react';

import { PostCardList } from '@/components';
import NewsletterCardStories from '@/components/Molecules/Cards/NewsletterCard/NewsletterCard.stories';
import * as PostCardListStories from '@/components/Organisms/PostCardList/PostCardList.stories';
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
