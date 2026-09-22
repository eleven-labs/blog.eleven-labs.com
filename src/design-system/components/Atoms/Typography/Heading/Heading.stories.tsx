import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { headingSizeTokenNameList } from '@/design-system/constants';
import { systemPropsControls } from '@/design-system/constants/storybook';

import { Heading } from './Heading';

export default {
  component: Heading,
  argTypes: {
    ...systemPropsControls,
    size: {
      control: { type: 'radio' },
      options: headingSizeTokenNameList,
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
