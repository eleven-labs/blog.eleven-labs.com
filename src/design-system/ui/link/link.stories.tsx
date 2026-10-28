import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from './link';

const meta = {
  title: 'UI/Navigation/Link',
  component: Link,
  args: {
    children: 'Lire la suite sur le blog',
    href: 'https://eleven-labs.com/',
  },
  parameters: {
    layout: 'centered',
  },
  // Les liens s'affichent sur une carte blanche, leur contexte réel
  decorators: [
    (Story) => (
      <div className="bg-surface p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { icon: 'language', children: 'Lire cet article en anglais' },
};
