import type { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  args: {
    items: [
      {
        label: 'Accueil',
        href: '#',
      },
      {
        label: 'JavaScript',
      },
    ],
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Overview: Story = {};
