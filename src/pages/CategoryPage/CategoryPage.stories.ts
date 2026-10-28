import type { CategoryPageProps } from './CategoryPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

import type { PostCardListProps } from '@/components/post-card-list';

import React from 'react';

import CategoryEndingBlockStories from '@/components/category-ending-block/category-ending-block.stories';
import CategoryIntroBlockStories from '@/components/category-intro-block/category-intro-block.stories';
import NewsletterCardStories from '@/components/newsletter-card/newsletter-card.stories';
import { PostCardList } from '@/components/post-card-list';
import * as PostCardListStories from '@/components/post-card-list/post-card-list.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { CategoryPage } from './CategoryPage';

const meta: Meta<typeof CategoryPage> = {
  title: 'Pages/Category',
  component: CategoryPage,
  args: {
    categoryIntroBlock: CategoryIntroBlockStories.args as CategoryPageProps['categoryIntroBlock'],
    title: 'Tous nos articles',
    postCardList: React.createElement<PostCardListProps>(PostCardList, {
      ...PostCardListStories.default.args,
      ...PostCardListStories.WithPagination.args,
    } as PostCardListProps),
    categoryEndingBlock: CategoryEndingBlockStories.args as CategoryPageProps['categoryEndingBlock'],
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
type Story = StoryObj<typeof CategoryPage>;

export const Overview: Story = {};
