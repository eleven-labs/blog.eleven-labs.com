import type { Meta, StoryObj } from '@storybook/react-vite';

import { Autocomplete } from './autocomplete';

const articles = [
  { title: 'Introduction à React Server Components', date: '12 mars 2025', author: ['aduval', 'Alice Duval'] },
  {
    title: 'Tester ses composants React avec Testing Library',
    date: '5 février 2025',
    author: ['mbernard', 'Marc Bernard'],
  },
  {
    title: 'React Query : gérer le cache de vos requêtes',
    date: '21 novembre 2024',
    author: ['cmoreau', 'Claire Moreau'],
  },
  { title: 'Migrer une application vers React 19', date: '3 octobre 2024', author: ['aduval', 'Alice Duval'] },
];

const meta = {
  title: 'Shared/Autocomplete',
  component: Autocomplete,
  args: {
    placeholder: 'Nom d’article, auteur ...',
    searchLink: {
      label: 'Voir tous les résultats',
      href: '#',
    },
    items: [],
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithResult: Story = {
  args: {
    isOpen: true,
    defaultValue: 'React',
    items: articles.map(({ title, date, author: [username, name] }, index) => ({
      slug: `slug-${index}`,
      title,
      date,
      authors: [{ username, name }],
      link: {
        href: '#',
      },
    })),
  },
};

export const WithNoResult: Story = {
  args: {
    isOpen: true,
    defaultValue: 'React',
    items: [],
    searchNotFound: {
      title: 'Aucun résultat en vue...',
      description: 'Vérifiez les termes de votre recherche avant de réessayer',
    },
  },
};
