import type { Meta, StoryObj } from '@storybook/react-vite';

import { Search } from 'lucide-react';

import { Button } from '@/design-system/ui/button';

const meta = {
  title: 'UI/Actions/Button',
  component: Button,
  args: {
    children: 'Lire l’article',
    variant: 'primary',
    size: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Rend `btn` + `btn-<variante>` + `btn-<taille>`.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Article précédent' },
};

export const Accent: Story = {
  args: { variant: 'accent', children: 'Voir tous les tutoriels' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Filtrer' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Annuler' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Supprimer' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'En savoir plus' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Envoyer' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Nous contacter' },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    'aria-label': 'Rechercher',
    children: <Search aria-hidden="true" />,
  },
};

// Plusieurs appelants rendent le bouton en lien : la balise change, le rendu non.
export const AsLink: Story = {
  args: {
    children: 'Nous contacter',
    render: <a href="https://eleven-labs.com/" target="_blank" rel="noreferrer" />,
  },
};
