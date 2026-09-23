import type { Meta, StoryFn } from '@storybook/react';

import React from 'react';

import { Skeleton, Text } from '@/design-system';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  args: {
    isLoading: true,
    children: <Text>Hello world !</Text>,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const Template: StoryFn<typeof Skeleton> = (args) => <Skeleton {...args} />;

export const Overview = Template.bind({});
