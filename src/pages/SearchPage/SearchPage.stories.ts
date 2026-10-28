import type { Meta, StoryObj } from '@storybook/react-vite';

import type { NewsletterCardProps } from '@/components/newsletter-card';
import type { PostCardListProps } from '@/components/post-card-list';

import React from 'react';

import { NewsletterCard } from '@/components/newsletter-card';
import NewsletterCardStories from '@/components/newsletter-card/newsletter-card.stories';
import { PostCardList } from '@/components/post-card-list';
import * as PostCardListStories from '@/components/post-card-list/post-card-list.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { SearchPage } from './SearchPage';

const meta: Meta<typeof SearchPage> = {
  component: SearchPage,
  args: {
    title: '26 résultats',
    description: 'triés par pertinence',
    postCardList: React.createElement<PostCardListProps>(PostCardList, {
      ...PostCardListStories.default.args,
      ...PostCardListStories.WithPagination.args,
    } as PostCardListProps),
    sidebar: [
      React.createElement<NewsletterCardProps>(NewsletterCard, NewsletterCardStories.args as NewsletterCardProps),
    ],
    isLoading: false,
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
type Story = StoryObj<typeof SearchPage>;

export const Overview: Story = {};

export const SearchPageIsLoading: Story = {};
SearchPageIsLoading.args = {
  isLoading: true,
  postCardList: React.createElement<PostCardListProps>(PostCardList, {
    posts: Array.from({ length: 6 }),
    isLoading: true,
  } as PostCardListProps),
};

export const SearchPageWithNoResult: Story = {};
SearchPageWithNoResult.args = {
  isLoading: false,
  searchNotFound: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
  postCardList: React.createElement<PostCardListProps>(PostCardList, {
    posts: [],
  } as PostCardListProps),
};
