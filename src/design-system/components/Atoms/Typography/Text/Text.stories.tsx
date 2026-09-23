import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  component: Text,
  args: {
    size: 'm',
    children: 'Example Text',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

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
