import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import NewsletterBlockStories from '@/components/NewsletterBlock/NewsletterBlock.stories';
import * as PostPreviewListStories from '@/components/PostPreviewList/PostPreviewList.stories';
import { AuthorPage } from '@/pages/AuthorPage/AuthorPage';

export default {
  title: 'Pages/Author',
  component: AuthorPage,
  args: {
    backLink: {
      label: 'Retour',
      href: '/',
    },
    author: {
      username: 'jdoe',
      name: 'John Doe',
      avatarImageUrl: 'https://api.dicebear.com/5.x/avataaars/svg?seed=Felix',
      description: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
    },
    title: `Article de l'auteur`,
    postPreviewList: {
      ...PostPreviewListStories.default.args,
      ...PostPreviewListStories.PostPreviewListWithPagination.args,
    },
    newsletterBlock: NewsletterBlockStories.args,
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof AuthorPage>;

const Template: StoryFn<typeof AuthorPage> = (args) => <AuthorPage {...args} />;

export const Overview = Template.bind({});
