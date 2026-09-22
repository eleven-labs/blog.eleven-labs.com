import type { Meta, StoryObj } from '@storybook/react';

import { PostFooter } from './PostFooter';

const meta: Meta<typeof PostFooter> = {
  component: PostFooter,
  args: {
    title: 'Auteur(s)',
    authors: [
      {
        name: 'John Doe',
        description: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
        link: {
          label: 'Voir le profil',
          href: '/fr/authors/jdoe',
        },
      },
      {
        name: 'Jeane Dupont',
        description: 'Astronaute Jeane Dupont @ ElevenLabs_\uD83D\uDE80',
        link: {
          label: 'Voir le profil',
          href: '/fr/authors/jdupont',
        },
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof PostFooter>;

export const Overview: Story = {};
