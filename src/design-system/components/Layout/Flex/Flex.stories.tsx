import type { Meta, StoryObj } from '@storybook/react';

import * as React from 'react';

import { Box, Flex } from '@/design-system';
import { flexOrGridSystemPropsControls, flexSystemPropsControls, systemPropsControls } from '@/design-system/constants/storybook';

const meta: Meta<typeof Flex> = {
  component: Flex,
  args: {
    display: 'flex',
    p: 'xxs',
    gap: 'm',
    justifyContent: 'center',
    children: Array.from({ length: 3 }).map((_, index) => (
      <Box key={index} p="m" bg="primary" color="white">
        {(index + 1).toString().padStart(2, '0')}
      </Box>
    )),
  },
  parameters: {
    layout: 'centered',
    controls: { exclude: ['as', 'children'] },
  },
  argTypes: {
    ...systemPropsControls,
    ...flexOrGridSystemPropsControls,
    ...flexSystemPropsControls,
  },
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Overview: Story = {};
