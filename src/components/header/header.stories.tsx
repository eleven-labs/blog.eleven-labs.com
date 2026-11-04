import type { HeaderProps } from './header';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { action } from 'storybook/actions';

import * as AutocompleteStories from '@/components/autocomplete/autocomplete.stories';

import { Header } from './header';

const autocompleteArgs = AutocompleteStories.default.args as HeaderProps['autocomplete'];

const meta = {
  title: 'Shared/Header',
  component: Header,
  args: {
    homeLink: {
      href: '#',
    },
    categories: [
      { label: 'Tous les articles', href: '#' },
      { label: 'Javascript', href: '#' },
      { label: 'PHP', href: '#' },
      { label: 'Agile', href: '#' },
      { label: 'Architecture', href: '#' },
      { label: 'Bonnes pratiques', href: '#' },
    ],
    hasTutorial: true,
    tutorialLink: {
      label: 'Tutoriels',
      href: '#',
    },
    contactLink: {
      label: 'Nous contacter',
      href: '#',
    },
    autocomplete: autocompleteArgs,
    onToggleMenu: action('toggleMenu'),
    searchButtonLabel: 'Rechercher un article',
    onToggleSearch: action('toggleSearch'),
  },
  globals: { viewport: { value: 'mobile', isRotated: false } },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MenuOpen: Story = {
  args: {
    menuIsOpen: true,
  },
};

export const SearchOpen: Story = {
  args: {
    searchIsOpen: true,
  },
};

export const SearchOpenWithResult: Story = {
  args: {
    searchIsOpen: true,
    autocomplete: {
      ...autocompleteArgs,
      ...AutocompleteStories.WithResult.args,
    } as HeaderProps['autocomplete'],
  },
};

export const AutocompleteOpen: Story = {
  args: {
    autocomplete: {
      ...autocompleteArgs,
      ...AutocompleteStories.WithResult.args,
    } as HeaderProps['autocomplete'],
  },
};

export const AutocompleteNotFound: Story = {
  args: {
    autocomplete: {
      ...autocompleteArgs,
      ...AutocompleteStories.WithNoResult.args,
    } as HeaderProps['autocomplete'],
  },
};
