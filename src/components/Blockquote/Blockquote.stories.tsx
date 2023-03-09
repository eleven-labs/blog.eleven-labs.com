import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Blockquote } from './Blockquote';

export default {
  title: 'Components/Blockquote',
  component: Blockquote,
  args: {
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nisi lectus, tincidunt nec nisl ut, dapibus ornare eros.',
  },
} as Meta<typeof Blockquote>;

const Template: StoryFn<typeof Blockquote> = (args) => <Blockquote {...args} />;

export const Overview = Template.bind({});
