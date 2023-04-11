import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { BackLink } from './BackLink';

export default {
  title: 'Components/BackLink',
  component: BackLink,
  args: {
    label: 'Retour',
    href: '/',
  },
} as Meta<typeof BackLink>;

const Template: StoryFn<typeof BackLink> = (args) => <BackLink {...args} />;

export const Overview = Template.bind({});
