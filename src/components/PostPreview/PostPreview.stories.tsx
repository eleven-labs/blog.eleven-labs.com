import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { PostPreview } from '@/components';
import { ContentTypeEnum } from '@/constants';

export default {
  title: 'Components/PostPreview',
  component: PostPreview,
  args: {
    contentType: ContentTypeEnum.ARTICLE,
    slug: 'slug',
    title: `REX Studio : Intégration de composants React avec Varnish ESI dans un site No Code`,
    date: '09 fév. 2021',
    readingTime: 24,
    authors: [{ username: 'jdoe', name: 'J. Doe' }],
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit vel tellus in molestie. Curabitur malesuada sodales consectetur. Aliquam convallis nec lacus in euismod. Vestibulum id eros vitae tellus sodales ultricies eget eu ipsum.',
    link: {
      href: '#',
    },
    tutorialLabel: 'Tutoriel',
    isLoading: false,
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [
    (Story): React.ReactElement => (
      <div style={{ maxWidth: '764px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof PostPreview>;

const Template: StoryFn<typeof PostPreview> = (args) => <PostPreview {...args} />;

export const Overview = Template.bind({});

export const PostPreviewIsLoading = Template.bind({});
PostPreviewIsLoading.args = {
  isLoading: true,
};

export const PostPreviewTutorial = Template.bind({});
PostPreviewTutorial.args = {
  contentType: ContentTypeEnum.TUTORIAL,
};
