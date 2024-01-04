import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { PostPreviewList, PostPreviewListProps } from '@/components';
import NewsletterBlockStories from '@/components/Blocks/NewsletterBlock/NewsletterBlock.stories';
import * as PostPreviewListStories from '@/components/PostPreviewList/PostPreviewList.stories';
import { SearchPage } from '@/pages';

export default {
  title: 'Pages/Search',
  component: SearchPage,
  args: {
    title: '26 résultats',
    description: 'triés par pertinence',
    postPreviewList: React.createElement<PostPreviewListProps>(PostPreviewList, {
      ...PostPreviewListStories.default.args,
      ...PostPreviewListStories.PostPreviewListWithPagination.args,
    } as PostPreviewListProps),
    newsletterBlock: NewsletterBlockStories.args,
    isLoading: false,
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof SearchPage>;

const Template: StoryFn<typeof SearchPage> = (args) => <SearchPage {...args} />;

export const SearchPageWithData = Template.bind({});

export const SearchPageIsLoading = Template.bind({});
SearchPageIsLoading.args = {
  isLoading: true,
  postPreviewList: React.createElement<PostPreviewListProps>(PostPreviewList, {
    posts: Array.from({ length: 6 }),
    isLoading: true,
  }),
};

export const SearchPageWithNoResult = Template.bind({});
SearchPageWithNoResult.args = {
  isLoading: false,
  searchNotFound: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
  postPreviewList: React.createElement<PostPreviewListProps>(PostPreviewList, {
    posts: [],
  }),
};
