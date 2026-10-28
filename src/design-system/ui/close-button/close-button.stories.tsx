import type { Meta, StoryObj } from '@storybook/react-vite';

import { CloseButton } from '@/design-system/ui/close-button';

const meta = {
  title: 'UI/Actions/CloseButton',
  component: CloseButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', 'aria-label': 'Effacer la recherche' },
};
