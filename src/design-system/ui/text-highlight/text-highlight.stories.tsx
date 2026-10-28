import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextHighlight } from './text-highlight';

const meta = {
  title: 'UI/Display/TextHighlight',
  component: TextHighlight,
  args: {
    text: 'Retour d’expérience sur la migration d’une application React vers Vite, avec les pièges rencontrés en chemin.',
    textQuery: 'react',
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TextHighlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutQuery: Story = { args: { textQuery: '' } };

export const SeveralOccurrences: Story = {
  args: {
    text: 'Tester ses composants : tests unitaires, tests de composants, tests visuels.',
    textQuery: 'tests',
  },
};
