import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { PostPreviewList, PostPreviewListProps } from '@/components';
import HomeIntroBlockStories from '@/components/Blocks/HomeIntroBlock/HomeIntroBlock.stories';
import * as PostPreviewListStories from '@/components/PostPreviewList/PostPreviewList.stories';

import { HomePage } from './HomePage';

export default {
  title: 'Pages/Home',
  component: HomePage,
  args: {
    homeIntroBlock: HomeIntroBlockStories.args,
    title: 'Tous nos articles',
    postPreviewList: React.createElement<PostPreviewListProps>(PostPreviewList, {
      ...PostPreviewListStories.default.args,
      ...PostPreviewListStories.PostPreviewListWithPagination.args,
    } as PostPreviewListProps),
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof HomePage>;

const Template: StoryFn<typeof HomePage> = (args) => <HomePage {...args} />;

export const Overview = Template.bind({});
