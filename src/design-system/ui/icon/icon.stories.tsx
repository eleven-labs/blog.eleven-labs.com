import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from './icon';
import { iconNameList } from './icon-name-list';

const meta = {
  title: 'UI/Display/Icon',
  component: Icon,
  args: {
    name: 'access-time',
    size: '3rem',
    className: 'text-brand',
    'aria-hidden': true,
  },
  argTypes: {
    name: { control: 'select', options: iconNameList },
    size: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Toutes les icônes du blog, avec leur nom. */
export const Gallery: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {iconNameList.map((name) => (
        <li key={name} className="flex flex-col items-center gap-2 rounded-card bg-surface p-4 shadow-card">
          <Icon {...args} name={name} />
          <span className="body-xs text-ink-soft">{name}</span>
        </li>
      ))}
    </ul>
  ),
};
