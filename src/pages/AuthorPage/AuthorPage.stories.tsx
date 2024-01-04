import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { PostPreviewList, PostPreviewListProps } from '@/components';
import NewsletterBlockStories from '@/components/Blocks/NewsletterBlock/NewsletterBlock.stories';
import * as PostPreviewListStories from '@/components/PostPreviewList/PostPreviewList.stories';
import { AuthorPage } from '@/pages/AuthorPage/AuthorPage';

export default {
  title: 'Pages/Author',
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
    emptyAvatarImageUrl: '/imgs/astronaut.png',
    title: `Article de l'auteur`,
    postPreviewList: React.createElement<PostPreviewListProps>(PostPreviewList, {
      ...PostPreviewListStories.default.args,
      ...PostPreviewListStories.PostPreviewListWithPagination.args,
    } as PostPreviewListProps),
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
