import type { Meta, StoryObj } from '@storybook/react-vite';

import { BurgerButton } from './BurgerButton';

const meta: Meta<typeof BurgerButton> = {
  component: BurgerButton,
};

export default meta;
type Story = StoryObj<typeof BurgerButton>;

export const Primary: Story = {};
