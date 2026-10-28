import type { Meta, StoryObj } from '@storybook/react-vite';

import { Blockquote } from './blockquote';

const meta = {
  title: 'UI/Display/Blockquote',
  component: Blockquote,
  args: {
    children:
      'Un design system ne se décrète pas : il se construit à partir des composants que l’équipe utilise vraiment.',
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongQuote: Story = {
  args: {
    children:
      'Les tokens sont la source unique des couleurs, des tailles et des espacements. Quand une valeur change, elle change à un seul endroit, et tout le blog suit, des cartes d’articles jusqu’aux encarts du markdown.',
  },
};
