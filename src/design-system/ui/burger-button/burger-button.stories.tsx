import type { Meta, StoryObj } from '@storybook/react-vite';

import { BurgerButton } from '@/design-system/ui/burger-button';

const meta = {
  title: 'UI/Actions/BurgerButton',
  component: BurgerButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BurgerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
