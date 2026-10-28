import type { Meta, StoryObj } from '@storybook/react-vite';

import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { NotFoundPage } from './NotFoundPage';

const meta: Meta<typeof NotFoundPage> = {
  component: NotFoundPage,
  args: {
    title: 'Page non trouvé',
    description: `Nous nous excusons pour le désagrément, mais la page que vous avez demandée n'a pas été trouvée.`,
  },
  parameters: {
    // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
    a11y: { test: 'todo' },
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Overview: Story = {};
