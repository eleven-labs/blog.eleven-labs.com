import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { systemPropsControls } from '@/design-system/constants/storybook';

import { Text } from './Text';

export default {
  component: Text,
  argTypes: {
    ...systemPropsControls,
  },
  args: {
    size: 'm',
    children: 'Example Text',
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Text>;

const Template: StoryFn<typeof Text> = (args) => <Text {...args} />;

export const TextWithSizeXS = Template.bind({});
TextWithSizeXS.args = {
  size: 'xs',
};

export const TextWithSizeS = Template.bind({});
TextWithSizeS.args = {
  size: 's',
};

export const TextWithSizeM = Template.bind({});
TextWithSizeM.args = {
  size: 'm',
};
