import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { ProgressBar } from './ProgressBar';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  args: {
    value: 30,
    max: 100,
  },
} as Meta<typeof ProgressBar>;

const Template: StoryFn<typeof ProgressBar> = (args) => <ProgressBar {...args} />;

export const Overview = Template.bind({});
