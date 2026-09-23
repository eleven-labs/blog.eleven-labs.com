import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { Heading, Box, Text } from '@/design-system';
import { systemPropsControls } from '@/design-system/constants/storybook';

const meta: Meta<typeof Box> = {
  component: Box,
  args: {
    p: 'm',
    bg: 'primary',
    color: 'white',
    children: <Heading textAlign="center">I'm a div Box ;</Heading>,
  },
  parameters: {
    layout: 'centered',
    controls: { exclude: ['as', 'children'] },
  },
  argTypes: {
    ...systemPropsControls,
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Overview: Story = {};

export const HiddenSystemProps: Story = {
  render: () => (
    <>
      <Box hiddenAbove="md">
        This text hides at the "md" value screen width or{' '}
        <Text as="span" fontWeight="bold">
          greater
        </Text>
      </Box>
      <Box hiddenBelow="sm">
        This text hides at the "sm" value screen width and{' '}
        <Text as="span" fontWeight="bold">
          smaller
        </Text>
      </Box>
    </>
  ),
};
