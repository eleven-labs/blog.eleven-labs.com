import type { Meta, StoryObj } from '@storybook/react';

import { Blockquote } from './Blockquote';

const meta: Meta<typeof Blockquote> = {
  component: Blockquote,
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nisi lectus, tincidunt nec nisl ut, dapibus ornare eros.',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Blockquote>;

export const Overview: Story = {};
