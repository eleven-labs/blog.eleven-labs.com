import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator';

const meta = {
  title: 'UI/Display/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-full">
      <p className="body-s">Derniers articles</p>
      <Separator {...args} className="my-2" />
      <p className="body-s">Articles les plus lus</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-6 items-center gap-4">
      <span className="body-s">Astro</span>
      <Separator {...args} />
      <span className="body-s">React</span>
      <Separator {...args} />
      <span className="body-s">Symfony</span>
    </div>
  ),
};
