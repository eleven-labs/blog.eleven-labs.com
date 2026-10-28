import type { Meta, StoryObj } from '@storybook/react-vite';

import { Logo, logoName } from './logo';

const meta = {
  title: 'Shared/Logo',
  component: Logo,
  argTypes: {
    name: { control: 'select', options: logoName },
    size: { control: 'text' },
  },
  args: {
    name: 'blog',
    className: 'text-brand',
    size: '10em',
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Website: Story = { args: { name: 'website' } };

export const Blog: Story = { args: { name: 'blog' } };
