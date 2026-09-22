import type { Meta, StoryFn } from '@storybook/react';

import React from 'react';

import { Skeleton, Text } from '@/design-system';
import { marginSystemPropsControls } from '@/design-system/constants/storybook';

export default {
  component: Skeleton,
  argTypes: {
    ...marginSystemPropsControls,
  },
  args: {
    isLoading: true,
    children: <Text>Hello world !</Text>,
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Skeleton>;

const Template: StoryFn<typeof Skeleton> = (args) => <Skeleton {...args} />;

export const Overview = Template.bind({});
