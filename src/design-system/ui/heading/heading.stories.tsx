import type { Meta, StoryObj } from '@storybook/react-vite';

import { headingSizeList } from '@/design-system/types';
import { Heading } from '@/design-system/ui/heading';

const meta = {
  title: 'UI/Display/Heading',
  component: Heading,
  argTypes: {
    size: { control: 'radio', options: headingSizeList },
  },
  args: {
    size: 'm',
    children: 'Optimiser les performances de votre application React',
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExtraSmall: Story = { args: { size: 'xs' } };

export const Small: Story = { args: { size: 's' } };

export const Default: Story = {};

export const Large: Story = { args: { size: 'l' } };

export const ExtraLarge: Story = {
  args: { size: 'xl', children: 'Le blog des experts' },
};
