import type { HeaderProps } from './Header';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { action } from 'storybook/actions';

import * as AutocompleteStories from '@/components/Organisms/Autocomplete/Autocomplete.stories';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Templates/LayoutTemplate/Header',
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
    autocomplete: AutocompleteStories.default.args as HeaderProps['autocomplete'],
    onToggleMenu: action('toggleMenu'),
    searchButtonLabel: 'Rechercher un article',
    onToggleSearch: action('toggleSearch'),
  },
  parameters: {
    // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
    a11y: { test: 'todo' },
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Overview: Story = {};

export const WithMenuIsOpen: Story = {
  args: {
    menuIsOpen: true,
  },
};

export const WithSearchIsOpen: Story = {
  args: {
    searchIsOpen: true,
  },
};

export const WithSearchIsOpenAndResult: Story = {
  args: {
    searchIsOpen: true,
    autocomplete: {
      ...AutocompleteStories.default.args,
      ...AutocompleteStories.WithResult.args,
    } as HeaderProps['autocomplete'],
  },
};

export const WithAutocompleteIsOpen: Story = {
  args: {
    autocomplete: {
      ...AutocompleteStories.default.args,
      ...AutocompleteStories.WithResult.args,
    } as HeaderProps['autocomplete'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'full',
    },
  },
};

export const WithAutocompleteAndResultNotFound: Story = {
  args: {
    autocomplete: {
      ...AutocompleteStories.default.args,
      ...AutocompleteStories.WithNoResult.args,
    } as HeaderProps['autocomplete'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'full',
    },
  },
};
