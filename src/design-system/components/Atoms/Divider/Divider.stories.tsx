import type { Meta, StoryFn } from '@storybook/react-vite';

import React from 'react';

import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  component: Divider,
  args: {
    className: 'bg-ink',
  },
};

export default meta;

const Template: StoryFn<typeof Divider> = (args) => <Divider {...args} />;

export const Overview = Template.bind({});
