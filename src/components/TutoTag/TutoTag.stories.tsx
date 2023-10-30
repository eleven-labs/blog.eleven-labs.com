import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { TutoTag } from './TutoTag';

export default {
  title: 'Components/TutoTag',
  component: TutoTag,
} as Meta<typeof TutoTag>;

const Template: StoryFn<typeof TutoTag> = (args) => <TutoTag {...args} />;

export const Overview = Template.bind({});
