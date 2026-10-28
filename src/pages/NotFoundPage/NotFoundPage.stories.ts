import type { Meta, StoryObj } from '@storybook/react-vite';

import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { NotFoundPage } from './NotFoundPage';

const meta: Meta<typeof NotFoundPage> = {
  title: 'Pages/NotFound',
  component: NotFoundPage,
  args: {
    title: 'Page non trouvé',
    description: `Nous nous excusons pour le désagrément, mais la page que vous avez demandée n'a pas été trouvée.`,
  },
  globals: { viewport: { value: 'mobile', isRotated: false } },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [LayoutTemplateDecorator],
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Overview: Story = {};
