import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './input';

const meta = {
  title: 'UI/Forms/Input',
  component: Input,
  args: {
    'aria-label': 'Adresse e-mail',
    placeholder: 'prenom.nom@exemple.fr',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'prenom.nom@exemple.fr' },
};

export const Invalid: Story = {
  args: { defaultValue: 'prenom.nom', 'aria-invalid': true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
