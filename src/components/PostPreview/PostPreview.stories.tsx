import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { PostPreview } from '@/components';
import { ContentTypeEnum } from '@/constants';

export default {
  title: 'Components/PostPreview',
  component: PostPreview,
  args: {
    contentType: ContentTypeEnum.ARTICLE,
    title: `Titre de l'article`,
    date: '09 fév. 2021',
    // image: {
    //   source: 'https://blog.eleven-labs.com/imgs/articles/2023-01-11-react-day-berlin/mnemonic.jpg',
    //   alt: 'alt',
    // },
    readingTime: '24mn',
    authors: [{ username: 'jdoe', name: 'J. Doe' }],
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit vel tellus in molestie. Curabitur malesuada sodales consectetur. Aliquam convallis nec lacus in euismod. Vestibulum id eros vitae tellus sodales ultricies eget eu ipsum.',
    isLoading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
} as Meta<typeof PostPreview>;

const Template: StoryFn<typeof PostPreview> = (args) => <PostPreview {...args} />;
const TemplateWithMargin: StoryFn<typeof PostPreview> = (args) => (
  <div style={{ margin: '0 2.5em' }}>
    <PostPreview {...args} />
  </div>
);

export const PostPreviewWithData = Template.bind({});

export const PostPreviewIsLoading = Template.bind({});
PostPreviewIsLoading.args = {
  isLoading: true,
};

export const PostPreviewHasMask = Template.bind({});
PostPreviewHasMask.args = {
  hasMask: true,
};

export const PostPreviewTutorial = Template.bind({});
PostPreviewTutorial.args = {
  contentType: ContentTypeEnum.TUTORIAL,
};

export const PostPreviewIsRelated = Template.bind({});
PostPreviewIsRelated.parameters = {
  backgrounds: {
    default: 'grey-ultra-light',
  },
};
PostPreviewIsRelated.args = {
  isRelated: true,
};

export const PostPreviewIsHighlighted = TemplateWithMargin.bind({});
PostPreviewIsHighlighted.args = {
  isHighlighted: true,
};
