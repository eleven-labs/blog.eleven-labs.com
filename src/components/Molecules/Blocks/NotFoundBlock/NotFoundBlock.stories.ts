import type { Meta, StoryObj } from '@storybook/react-vite';

import { NotFoundBlock } from './NotFoundBlock';

const meta: Meta<typeof NotFoundBlock> = {
  // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
  parameters: { a11y: { test: 'todo' } },
  component: NotFoundBlock,
  args: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundBlock>;

export const Overview: Story = {};
