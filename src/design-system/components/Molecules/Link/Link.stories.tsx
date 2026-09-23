import type { Meta, StoryObj } from '@storybook/react';

import type { LinkProps } from '@/design-system';

import { Link } from '@/design-system';

const meta: Meta<LinkProps<'a'>> = {
  component: Link,
  args: {
    children: 'Link Label',
    href: 'https://eleven-labs.com/',
    target: '_blank',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const LinkWithIcon: Story = {
  args: { icon: 'language' },
};
