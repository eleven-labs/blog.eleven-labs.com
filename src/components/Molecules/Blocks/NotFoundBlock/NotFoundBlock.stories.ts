import type { Meta, StoryObj } from '@storybook/react';

import { NotFoundBlock } from './NotFoundBlock';

const meta: Meta<typeof NotFoundBlock> = {
  component: NotFoundBlock,
  args: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundBlock>;

export const Overview: Story = {};
