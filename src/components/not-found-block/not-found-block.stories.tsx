import type { Meta, StoryObj } from '@storybook/react-vite';

import { NotFoundBlock } from './not-found-block';

const meta = {
  title: 'Shared/NotFoundBlock',
  component: NotFoundBlock,
  args: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
} satisfies Meta<typeof NotFoundBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
