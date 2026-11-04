import type { Meta, StoryObj } from '@storybook/react-vite';

import { AuthorCard } from './author-card';

const meta = {
  title: 'Shared/AuthorCard',
  component: AuthorCard,
  args: {
    name: 'Marie Dupont',
    description: 'Astronaute développeuse @ Eleven Labs_🚀',
    link: {
      label: 'Voir le profil',
      href: '/fr/authors/mdupont',
    },
  },
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const WithAvatar: Story = {
  args: { avatarImageUrl: '/imgs/astronaut.png' },
};
