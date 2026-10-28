import type { Meta, StoryObj } from '@storybook/react-vite';

import { action } from 'storybook/actions';

import { SearchField } from './search-field';

const meta = {
  title: 'UI/Forms/SearchField',
  component: SearchField,
  args: {
    input: {
      'aria-label': 'Rechercher un article',
      placeholder: 'Nom d’article, auteur ...',
    },
    buttonClose: {
      onClick: action('onClose'),
    },
    buttonSearch: {
      onClick: action('onSearch'),
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    input: {
      'aria-label': 'Rechercher un article',
      value: 'Design System',
      onChange: action('onChange'),
    },
  },
};
