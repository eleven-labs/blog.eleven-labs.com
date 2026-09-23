import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { Icon , iconNameList } from '@/design-system';

export default {
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: iconNameList,
    },
    size: {
      control: 'text',
    },
  },
  args: {
    size: '10rem',
    color: 'primary',
    name: 'access-time',
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Icon>;

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Overview = Template.bind({});
