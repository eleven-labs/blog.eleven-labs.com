import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd } from './kbd';
import { KbdGroup } from './kbd-group';

const meta = {
  title: 'UI/Display/Kbd',
  component: Kbd,
  args: { children: 'Maj' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Une combinaison de touches, dans une phrase. */
export const Group: Story = {
  render: () => (
    <p className="body-s">
      Pour rechercher un article, tapez{' '}
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      .
    </p>
  ),
};
