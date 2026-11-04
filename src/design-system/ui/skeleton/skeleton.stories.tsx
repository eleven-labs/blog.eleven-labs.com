import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Feedback/Skeleton',
  component: Skeleton,
  args: {
    isLoading: true,
    children: <p className="body-s">Migrer un design system vers Base UI sans casser le blog</p>,
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

/** Une fois chargé, le contenu est rendu tel quel. */
export const Loaded: Story = { args: { isLoading: false } };

/** Sans contenu, le squelette prend la hauteur d’une ligne. */
export const Empty: Story = {
  args: { children: undefined, className: 'w-64' },
};
