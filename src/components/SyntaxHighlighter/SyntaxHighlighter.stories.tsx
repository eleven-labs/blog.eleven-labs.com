import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { SyntaxHighlighter } from './SyntaxHighlighter';

export default {
  title: 'Components/SyntaxHighlighter',
  component: SyntaxHighlighter,
  args: {
    content: 'import React from React;',
  },
} as Meta<typeof SyntaxHighlighter>;

const Template: StoryFn<typeof SyntaxHighlighter> = (args) => <SyntaxHighlighter {...args} />;

export const Overview = Template.bind({});
