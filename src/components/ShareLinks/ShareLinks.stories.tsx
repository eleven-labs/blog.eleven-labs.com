import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { ShareLinks } from './ShareLinks';

export default {
  title: 'Components/ShareLinks',
  component: ShareLinks,
  args: {
    urlToShare: 'https://eleven-labs.com/',
    socialMedias: [
      {
        name: 'twitter',
        isVisible: true,
      },
      {
        name: 'facebook',
        isVisible: true,
      },
      {
        name: 'linkedIn',
        isVisible: true,
      },
    ],
  },
} as Meta<typeof ShareLinks>;

const Template: StoryFn<typeof ShareLinks> = (args) => <ShareLinks {...args} />;

export const Overview = Template.bind({});
