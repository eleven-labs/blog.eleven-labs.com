import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { TextHighlight } from '@/design-system';
import { marginSystemPropsControls } from '@/design-system/constants/storybook';

export default {
  component: TextHighlight,
  argTypes: {
    ...marginSystemPropsControls,
  },
  args: {
    text: `Suspendisse potenti. Etiam egestas lacus velit, et tempor metus mollis react. Donec ut vulputate leo ...`,
    textQuery: 'React',
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof TextHighlight>;

const Template: StoryFn<typeof TextHighlight> = (args) => <TextHighlight {...args} />;

export const Overview = Template.bind({});
