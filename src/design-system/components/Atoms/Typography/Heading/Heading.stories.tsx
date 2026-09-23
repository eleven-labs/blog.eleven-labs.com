import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { headingSizeList } from '@/design-system';

import { Heading } from './Heading';

export default {
  component: Heading,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: headingSizeList,
    },
  },
  args: {
    size: 'm',
    children: 'Example Heading',
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Heading>;

const Template: StoryFn<typeof Heading> = (args) => <Heading {...args} />;

export const HeadingWithSizeS = Template.bind({});
HeadingWithSizeS.args = {
  size: 's',
};

export const HeadingWithSizeM = Template.bind({});
HeadingWithSizeM.args = {
  size: 'm',
};

export const HeadingWithSizeL = Template.bind({});
HeadingWithSizeL.args = {
  size: 'l',
};

export const HeadingWithSizeXL = Template.bind({});
HeadingWithSizeXL.args = {
  size: 'xl',
};
