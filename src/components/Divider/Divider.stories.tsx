import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Divider } from './Divider';

export default {
  title: 'Components/Divider',
  component: Divider,
  args: {
    bg: 'black',
  },
} as Meta<typeof Divider>;

const Template: StoryFn<typeof Divider> = (args) => <Divider {...args} />;

export const Overview = Template.bind({});
