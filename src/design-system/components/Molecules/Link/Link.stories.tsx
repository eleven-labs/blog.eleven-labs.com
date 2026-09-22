import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { Heading, Text } from '@/design-system';

import { Link } from './Link';

export default {
  component: Link,
  args: {
    children: 'Link Label',
    href: 'https://eleven-labs.com/',
    target: '_blank',
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Link>;

const Template: StoryFn<typeof Link> = (args) => <Link {...args} />;

export const LinkWithText = Template.bind({});
LinkWithText.args = {
  as: Text,
  size: 'm',
};

export const LinkWithHeading = Template.bind({});
LinkWithHeading.args = {
  as: Heading,
  size: 'l',
};

export const LinkWithIcon = Template.bind({});
LinkWithIcon.args = {
  icon: 'language',
};
