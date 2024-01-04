import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { PostPreviewList, PostPreviewListProps } from '@/components';
import CategoryEndingBlockStories from '@/components/Blocks/CategoryEndingBlock/CategoryEndingBlock.stories';
import CategoryIntroBlockStories from '@/components/Blocks/CategoryIntroBlock/CategoryIntroBlock.stories';
import * as PostPreviewListStories from '@/components/PostPreviewList/PostPreviewList.stories';
import { CategoryPage } from '@/pages';

export default {
  title: 'Pages/Category',
  component: CategoryPage,
  args: {
    categoryIntroBlock: CategoryIntroBlockStories.args,
    title: 'Tous nos articles',
    postPreviewList: React.createElement<PostPreviewListProps>(PostPreviewList, {
      ...PostPreviewListStories.default.args,
      ...PostPreviewListStories.PostPreviewListWithPagination.args,
    } as PostPreviewListProps),
    categoryEndingBlock: CategoryEndingBlockStories.args,
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof CategoryPage>;

const Template: StoryFn<typeof CategoryPage> = (args) => <CategoryPage {...args} />;

export const Overview = Template.bind({});
