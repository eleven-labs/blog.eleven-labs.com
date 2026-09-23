import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { Icon , iconNameList } from '@/design-system';

const meta: Meta<typeof Icon> = {
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
    className: 'text-primary',
    name: 'access-time',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Overview = Template.bind({});
