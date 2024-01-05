import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { ArticleMetadata } from '@/components';

export default {
  title: 'Components/ArticleMetadata',
  component: ArticleMetadata,
  args: {
    date: '09 fév. 2021',
    readingTime: 24,
    authors: [{ username: 'jdoe', name: 'J. Doe' }],
    isLoading: false,
  },
} as Meta<typeof ArticleMetadata>;

const Template: StoryFn<typeof ArticleMetadata> = (args) => <ArticleMetadata {...args} />;

export const Overview = Template.bind({});

export const ArticleMetadataIsLoading = Template.bind({});
ArticleMetadataIsLoading.args = {
  isLoading: true,
};
