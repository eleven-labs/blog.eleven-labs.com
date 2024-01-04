import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import * as AutocompleteFieldStories from '@/components/AutocompleteField/AutocompleteField.stories';

import { Header, HeaderProps } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Templates/LayoutTemplate/Header',
  component: Header,
  args: {
    homeLink: {
      href: '#',
    },
    categories: [
      { isActive: true, label: 'Tous les articles', href: '#' },
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
    autocomplete: AutocompleteFieldStories.default.args as HeaderProps['autocomplete'],
    onToggleMenu: action('toggleMenu'),
  },
  parameters: {
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

export const WithAutocompleteIsOpen: Story = {
  args: {
    autocomplete: {
      ...AutocompleteFieldStories.default.args,
      ...AutocompleteFieldStories.AutocompleteFieldWithResult.args,
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
      ...AutocompleteFieldStories.default.args,
      ...AutocompleteFieldStories.AutocompleteFieldWithNoResult.args,
    } as HeaderProps['autocomplete'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'full',
    },
  },
};
