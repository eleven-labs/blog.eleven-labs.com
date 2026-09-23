import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/design-system';

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    variant: 'primary',
    disabled: false,
    children: 'Label',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const ButtonWithVariantPrimary: Story = {};
ButtonWithVariantPrimary.args = {
  variant: 'primary',
};

export const ButtonWithVariantSecondary: Story = {};
ButtonWithVariantSecondary.args = {
  variant: 'secondary',
};

export const ButtonWithVariantAccent: Story = {};
ButtonWithVariantAccent.args = {
  variant: 'accent',
};
