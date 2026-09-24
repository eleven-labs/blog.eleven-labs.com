import type { Meta, StoryObj } from '@storybook/react';

import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
  component: Kbd,
  args: {
    children: 'Shift',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Overview: Story = {};
