import type { Meta, StoryObj } from '@storybook/react';

import { ShareLinks } from './ShareLinks';

const meta: Meta<typeof ShareLinks> = {
  component: ShareLinks,
  args: {
    urlToShare: 'https://eleven-labs.com/',
    shares: {
      twitter: true,
      facebook: true,
      linkedIn: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShareLinks>;

export const Overview: Story = {};
