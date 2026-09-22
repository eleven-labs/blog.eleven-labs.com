import type { CategoryPageProps } from './CategoryPage';
import type { Meta, StoryObj } from '@storybook/react';

import type { PostCardListProps } from '@/components';

import React from 'react';

import { PostCardList } from '@/components';
import CategoryEndingBlockStories from '@/components/Molecules/Blocks/CategoryEndingBlock/CategoryEndingBlock.stories';
import CategoryIntroBlockStories from '@/components/Molecules/Blocks/CategoryIntroBlock/CategoryIntroBlock.stories';
import NewsletterCardStories from '@/components/Molecules/Cards/NewsletterCard/NewsletterCard.stories';
import * as PostCardListStories from '@/components/Organisms/PostCardList/PostCardList.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { CategoryPage } from './CategoryPage';

const meta: Meta<typeof CategoryPage> = {
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
