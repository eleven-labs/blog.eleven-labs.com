import type { Meta, StoryObj } from '@storybook/react';

import { marginSystemPropsControls } from '@/design-system/constants/storybook';

import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  argTypes: {
    ...marginSystemPropsControls,
  },
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
