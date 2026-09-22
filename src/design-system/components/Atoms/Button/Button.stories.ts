import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/design-system';
import { spacingSystemPropsControls } from '@/design-system/constants/storybook';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    ...spacingSystemPropsControls,
  },
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
