import type { Meta, StoryObj } from '@storybook/react';

import { AuthorCard } from './AuthorCard';

const meta: Meta<typeof AuthorCard> = {
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
