import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { SeparatorCircle } from './SeparatorCircle';

export default {
  title: 'Components/SeparatorCircle',
  component: SeparatorCircle,
  args: {},
} as Meta<typeof SeparatorCircle>;

const Template: StoryFn<typeof SeparatorCircle> = (args) => <SeparatorCircle {...args} />;

export const Overview = Template.bind({});
