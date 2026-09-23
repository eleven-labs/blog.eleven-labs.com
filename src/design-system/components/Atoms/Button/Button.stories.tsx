import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

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
type Story = StoryObj<typeof meta>;

export const ButtonWithVariantPrimary: Story = {
  args: { variant: 'primary' },
};

export const ButtonWithVariantSecondary: Story = {
  args: { variant: 'secondary' },
};

export const ButtonWithVariantAccent: Story = {
  args: { variant: 'accent' },
};

// Plusieurs appelants rendent le bouton en lien : la balise change, le rendu non.
export const ButtonAsLink: Story = {
  args: { render: <a href="https://eleven-labs.com/" target="_blank" rel="noreferrer" /> },
};
