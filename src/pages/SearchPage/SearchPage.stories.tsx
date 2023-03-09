import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import NewsletterBlockStories from '@/components/NewsletterBlock/NewsletterBlock.stories';
import * as PostPreviewListStories from '@/components/PostPreviewList/PostPreviewList.stories';

import { SearchPage } from './SearchPage';

export default {
  title: 'Pages/Search',
  component: SearchPage,
  args: {
    backLink: {
      label: 'Retour',
      href: '/',
    },
    title: '26 résultats',
    description: 'triés par pertinence',
    postPreviewList: {
      ...PostPreviewListStories.default.args,
      ...PostPreviewListStories.PostPreviewListWithPagination.args,
    },
    newsletterBlock: NewsletterBlockStories.args,
    searchNotFound: {
      title: 'Aucun résultat en vue...',
      description: 'Vérifiez les termes de votre recherche avant de réessayer',
    },
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

export const Overview = Template.bind({});

export const SearchPageWithNoResult = Template.bind({});
SearchPageWithNoResult.args = {
  postPreviewList: {
    posts: [],
  },
};
