import type { Meta, StoryObj } from '@storybook/react';

import type { ButtonProps } from '@/design-system';

import { Button } from '@/design-system';

// Le composant étant polymorphe, on fige la balise pour que storybook connaisse les attributs de
// `<button>`, `disabled` en tête.
const meta: Meta<ButtonProps<'button'>> = {
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
export const ButtonAsLink: StoryObj<ButtonProps<'a'>> = {
  args: { as: 'a', href: 'https://eleven-labs.com/', target: '_blank' },
};
