import type { Meta, StoryObj } from '@storybook/react';

import { Autocomplete } from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  args: {
    placeholder: 'Nom d’article, auteur ...',
    searchLink: {
      label: 'Voir tous les résultats',
      href: '#',
    },
  },
  parameters: {
    backgrounds: {
      default: 'ultra-light-grey',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

export const Overview: Story = {};

export const WithResult: Story = {};
WithResult.args = {
  isOpen: true,
  defaultValue: 'React',
  items: Array.from({ length: 4 }).map((_, index) => ({
    slug: `slug-${index}`,
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget elit turpis. Aliquam sit amet leo mauris vehicula enim id ante aliquam',
    date: '24 fév. 2021',
    authors: [{ username: 'jdoe', name: 'J. Doe' }],
    link: {
      href: '#',
    },
  })),
};

export const WithNoResult: Story = {};
WithNoResult.args = {
  isOpen: true,
  defaultValue: 'React',
  items: [],
  searchNotFound: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
};
