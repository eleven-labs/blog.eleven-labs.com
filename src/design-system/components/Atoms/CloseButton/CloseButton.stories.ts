import type { Meta, StoryObj } from '@storybook/react-vite';

import { CloseButton } from './CloseButton';

const meta: Meta<typeof CloseButton> = {
  component: CloseButton,
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Primary: Story = {};
