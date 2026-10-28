import type { Meta, StoryObj } from '@storybook/react-vite';

import { AuthorCard } from './AuthorCard';

const meta: Meta<typeof AuthorCard> = {
  // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
  parameters: { a11y: { test: 'todo' } },
  component: AuthorCard,
  args: {
    name: 'John Doe',
    description: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
    link: {
      label: 'Voir le profil',
      href: '/fr/authors/jdoe',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthorCard>;

export const Overview: Story = {};
